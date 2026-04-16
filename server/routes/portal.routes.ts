import { Router } from "express";
import * as portalController from "../controllers/portal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

// All routes require auth + admin role
router.use(requireAuth);
router.use(requireRole("admin"));

// Staff management
router.post("/staff",                        portalController.createStaff);
router.get ("/staff",                        portalController.getAllStaff);
router.patch("/staff/:userId/permissions",   portalController.updatePermissions);

// Client management
router.post("/clients",                      portalController.createClient);
router.get ("/clients",                      portalController.getAllClients);

export default router;
