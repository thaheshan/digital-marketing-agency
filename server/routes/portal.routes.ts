import { Router } from "express";
import * as portalController from "../controllers/portal.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

// Client Portal Routes (accessible to clients)
router.get("/dashboard", requireRole("client"), portalController.getClientDashboard);
router.get("/campaigns", requireRole("client"), portalController.getClientCampaigns);
router.get("/goals", requireRole("client"), portalController.getClientGoals);
router.get("/reports", requireRole("client"), portalController.getClientReports);
router.get("/analytics", requireRole("client"), portalController.getClientAnalytics);
router.patch("/profile", requireRole("client"), portalController.updateClientProfile);
router.get("/campaigns/:id", requireRole("client"), portalController.getClientCampaignData);
router.get("/support", requireRole("client"), portalController.getSupportTickets);
router.post("/support", requireRole("client"), portalController.createSupportTicket);
router.get("/search", requireRole("client"), portalController.portalSearch);
router.get("/notifications", requireRole("client"), portalController.getNotifications);
router.patch("/notifications/:id/read", requireRole("client"), portalController.markNotificationRead);
router.patch("/notifications/read-all", requireRole("client"), portalController.markAllNotificationsRead);

// Admin Routes for managing staff and clients
router.post("/staff", requireRole("admin"), portalController.createStaff);
router.get ("/staff", requireRole("admin"), portalController.getAllStaff);
router.patch("/staff/:userId/permissions", requireRole("admin"), portalController.updatePermissions);

router.post("/clients", requireRole("admin"), portalController.createClient);
router.get ("/clients", requireRole("admin", "staff"), portalController.getAllClients);

export default router;
