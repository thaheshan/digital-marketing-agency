import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

router.get("/dashboard",          analyticsController.getDashboard);
router.get("/campaigns/:id",      analyticsController.getCampaignAnalytics);
router.get("/snapshot",           requireRole("admin"), analyticsController.getSnapshot);

export default router;
