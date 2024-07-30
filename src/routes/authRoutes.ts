import { Router } from "express";
import { body, param } from "express-validator";
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
);

router.post('/login',
  body("email")
    .isEmail().withMessage("El correo electrónico no es válido"),
  body("password")
    .notEmpty().withMessage("La contraseña no puede ir vacía"),
  handleInputErrors,
  AuthController.login
);

router.post('/request-code',
  body("email")
    .isEmail().withMessage("El correo electrónico no es válido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post('/forgot-password',
  body("email")
    .isEmail().withMessage("El correo electrónico no es válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post('/validate-token',
  body('token')
    .notEmpty().withMessage('El Token no puede ir'),
  handleInputErrors,
  AuthController.validateToken
);

router.post('/update-password/:token',
  param('token')
    .isNumeric().withMessage("Token no es válido"),
  body("password")
  .isLength({ min: 8 }).withMessage("La contraseña es muy corta, mínimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (req.body.password !== value) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

export default router;
