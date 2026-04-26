import { Router } from "express";
import * as portfolioController from "../controllers/portfolio.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/public", portfolioController.getPublishedPortfolioItems);
router.get("/public/:slug", portfolioController.getPublishedItemBySlug);

// Admin routes
router.post("/", requireAuth, requireRole("admin", "staff"), portfolioController.createItem);
router.put("/:id", requireAuth, requireRole("admin", "staff"), portfolioController.updateItem);
router.delete("/:id", requireAuth, requireRole("admin", "staff"), portfolioController.deleteItem);
router.post("/:id/generate-description", requireAuth, requireRole("admin", "staff"), portfolioController.generateDescription);

export default router;
