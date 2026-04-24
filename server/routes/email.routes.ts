import { Router } from "express";
import * as emailController from "../controllers/email.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Only admin can management email stuff directly if needed
router.use(requireAuth, requireRole("admin"));

router.get("/status", emailController.getStatus);
router.post("/send-test", emailController.sendTestEmail);

export default router;
