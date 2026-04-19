import { Router } from "express";
import * as leadsController from "../controllers/leads.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// All routes here should be protected for admin/staff
router.use(requireAuth, requireRole("admin", "content_manager"));

router.get("/", leadsController.getEnquiries);
router.get("/:id", leadsController.getEnquiryDetail);
router.put("/:id/status", leadsController.updateStatus);
router.post("/:id/convert", leadsController.convertEnquiry);
router.post("/:id/notes", leadsController.addNote);

export default router;
