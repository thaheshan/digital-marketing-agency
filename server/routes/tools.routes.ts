import { Router } from "express";
import * as toolsController from "../controllers/tools.controller";

const router = Router();

// Public — no auth required
router.post("/roi-calculator",     toolsController.calculateRoi);
router.get ("/roi-calculator/:id", toolsController.getRoiResult);
router.post("/website-audit",      toolsController.runAudit);
router.post("/sentiment",          toolsController.evaluateSentiment);
router.post("/personalize",        toolsController.getPersonalization);

export default router;