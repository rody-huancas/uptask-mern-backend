import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = new User(req.body);

      // hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send("Cuenta creada, revisa tu correo para confirmarla.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
