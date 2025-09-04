import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import validate from "../validations/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";
import upload from "../middlewares/avatarupload.js";

const router = Router();
// artinya upload.single("avatar") akan mencari field bernama "avatar" di form-data dan
// menyimpannya di req.file, lalu validate(registerSchema) akan memvalidasi req.body lalu akan dipanggil authController.register
router.post("/register", upload.single("avatar"), validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
// router.get("/me", requireAuth, authController.me);

export default router;
