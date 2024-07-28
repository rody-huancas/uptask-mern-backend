import { Request, Response } from "express";

import User from "../models/User";
import Token from "../models/Token";

import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/token";
import { checkPassword, hashPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // prevenir duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El Usuario ya está registrado.");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);

      // hash password
      user.password = await hashPassword(password);

      // generar token
      const token = new Token();

      token.token = generateToken();
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email, name: user.name, token: token.token
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu correo para confirmarla.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("Token inválido");
        return res.status(401).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([ user.save(), tokenExists.deleteOne() ]);

      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      // Si el usuario no está confirmado, enviar nuevamente un email
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();

        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email, name: user.name, token: token.token
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos envíado un E-mail de confirmación."
        );
        return res.status(401).json({ error: error.message });
      }

      // Revisar contraseñas
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(401).json({ error: error.message });
      }

      res.send("Autenticado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Ususario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no está registrado.");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El Usuario ya está confirmado.");
        return res.status(403).json({ error: error.message });
      }

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email, name: user.name, token: token.token
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envió un nuevo token, revisa tu correo para confirmarla.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
