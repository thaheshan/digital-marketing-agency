import { Router } from "express";
import * as portfolioController from "../controllers/portfolio.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/",           portfolioController.getItems);
router.get("/services",   portfolioController.getServices);
router.get("/testimonials", portfolioController.getTestimonials);
router.get("/:slug",      portfolioController.getItem);

// Protected routes
router.post("/",          requireAuth, requireRole("admin", "content_manager"), portfolioController.createItem);
router.patch("/:id",      requireAuth, requireRole("admin", "content_manager"), portfolioController.updateItem);
router.delete("/:id",     requireAuth, requireRole("admin"), portfolioController.deleteItem);
router.post("/:id/generate-description", requireAuth, requireRole("admin", "content_manager"), portfolioController.generateDescription);

export default router;
