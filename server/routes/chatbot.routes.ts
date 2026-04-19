import { Router } from "express";
import * as chatbotController from "../controllers/chatbot.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public 
router.post("/session", chatbotController.processMessage);

// Admin
router.get("/sessions", requireAuth, requireRole("admin"), chatbotController.getSessions);
router.get("/sessions/:id", requireAuth, requireRole("admin"), chatbotController.getSessionDetail);
router.get("/knowledge", requireAuth, requireRole("admin"), chatbotController.getKnowledgeBase);
router.put("/knowledge/:id", requireAuth, requireRole("admin"), chatbotController.updateKnowledgeBaseItem);

export default router;
