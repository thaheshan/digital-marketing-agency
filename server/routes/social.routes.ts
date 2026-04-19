import { Router } from "express";
import * as socialController from "../controllers/social.controller";

const router = Router();

router.get("/", socialController.getFeed);

export default router;
