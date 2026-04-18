import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { authRateLimit } from "../middlewares/rateLimit.middleware";

const router = Router();
router.post("/register",        authRateLimit, authController.register);
router.post("/login",           authRateLimit, authController.login);
router.post("/logout",          requireAuth,   authController.logout);
router.get ("/me",              requireAuth,   authController.getMe);
router.post("/verify-email",    authController.verifyEmail);
router.post("/forgot-password", authRateLimit, authController.forgotPassword);
router.post("/reset-password",  authRateLimit, authController.resetPassword);
export default router;
