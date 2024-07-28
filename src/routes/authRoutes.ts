import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post("/create-account",
  body("name")
    .notEmpty().withMessage("El nombre no puede ir vacío"),
  body("password")
    .isLength({ min: 8 }).withMessage("La contraseña es muy corta, mínimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (req.body.password !== value) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  body("email")
    .isEmail().withMessage("El correo electrónico no es válido"),
  handleInputErrors,
  AuthController.createAccount
);

router.post('/confirm-account', 
  body('token')
    .notEmpty().withMessage('El Token no puede ir'),
  handleInputErrors,
  AuthController.confirmAccount
)

export default router;
