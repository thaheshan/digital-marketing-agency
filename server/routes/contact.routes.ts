import { Router } from "express";
import * as contactController from "../controllers/contact.controller";

const router = Router();

router.post("/", contactController.submitEnquiry);
router.post("/visitor-track", contactController.trackVisitor);

export default router;
