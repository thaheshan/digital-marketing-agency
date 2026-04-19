import { Router } from "express";
import * as toolsController from "../controllers/tools.controller";

const router = Router();

router.post("/roi-calculator", toolsController.calculateRoi);
router.post("/website-audit", toolsController.runAudit);
router.post("/sentiment", toolsController.evaluateSentiment);
router.post("/personalize", toolsController.getPersonalization);

export default router;
