import { Router } from "express";
import * as portalController from "../controllers/portal.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

// Client Portal Routes (accessible to clients)
router.get("/dashboard", requireRole("client"), portalController.getClientDashboard);
router.get("/campaigns", requireRole("client"), portalController.getClientCampaigns);
router.get("/campaigns/:id", requireRole("client"), portalController.getClientCampaignData);

// Admin Routes for managing staff and clients
router.post("/staff", requireRole("admin"), portalController.createStaff);
router.get ("/staff", requireRole("admin"), portalController.getAllStaff);
router.patch("/staff/:userId/permissions", requireRole("admin"), portalController.updatePermissions);

router.post("/clients", requireRole("admin"), portalController.createClient);
router.get ("/clients", requireRole("admin", "content_manager"), portalController.getAllClients);

export default router;
