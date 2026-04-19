import { Router } from "express";
import * as leadsController from "../controllers/leads.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);
router.use(requireRole("admin", "content_manager"));

router.get("/",              leadsController.getEnquiries);
router.get("/factors",       leadsController.getScoreFactors);
router.get("/:id",           leadsController.getEnquiry);
router.patch("/:id/status",  leadsController.updateStatus);
router.post("/:id/convert",  leadsController.convertToClient);
router.post("/:id/notes",    leadsController.addNote);

export default router;
