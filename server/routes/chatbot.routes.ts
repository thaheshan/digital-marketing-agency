import { Router } from "express";
import * as chatbotController from "../controllers/chatbot.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/session",              chatbotController.chat);
router.get ("/sessions",             requireAuth, requireRole("admin", "content_manager"), chatbotController.getSessions);
router.get ("/sessions/:id",         requireAuth, requireRole("admin", "content_manager"), chatbotController.getSession);
router.get ("/knowledge",            chatbotController.getKnowledgeBase);
router.post("/knowledge",            requireAuth, requireRole("admin", "content_manager"), chatbotController.createKnowledgeBaseItem);
router.patch("/knowledge/:id",       requireAuth, requireRole("admin", "content_manager"), chatbotController.updateKnowledgeBaseItem);
router.delete("/knowledge/:id",      requireAuth, requireRole("admin", "content_manager"), chatbotController.deleteKnowledgeBaseItem);

export default router;
