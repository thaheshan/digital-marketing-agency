import { Router } from "express";
import * as socialController from "../controllers/social.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/status", socialController.getSocialStatus);
router.get("/posts",  socialController.getRecentPosts);

export default router;