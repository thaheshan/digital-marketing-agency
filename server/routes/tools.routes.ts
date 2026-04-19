import { Router } from "express";
import * as toolsController from "../controllers/tools.controller";

const router = Router();

// Public — no auth required
router.post("/roi-calculator",     toolsController.calculateRoi);
router.get ("/roi-calculator/:id", toolsController.getRoiResult);

export default router;
