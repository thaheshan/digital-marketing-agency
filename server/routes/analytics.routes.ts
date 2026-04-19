import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// All analytics are admin restricted
router.use(requireAuth, requireRole("admin"));

router.get("/overview", analyticsController.getOverview);
router.get("/campaigns/:id", analyticsController.getCampaignAnalytics);
router.get("/content-performance", analyticsController.getContentPerformance);

export default router;
