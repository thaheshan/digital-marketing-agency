import { Router } from "express";
import * as blogController from "../controllers/blog.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { adminController } from "../controllers/admin.controller";

const router = Router();

// Public routes
router.get("/public", blogController.getPublishedBlogPosts);
router.get("/public/:slug", blogController.getBlogPostBySlug);

// Admin routes (using methods from adminController for now as they exist)
router.post("/", requireAuth, requireRole("admin", "content_manager"), adminController.createBlogPost);

export default router;
