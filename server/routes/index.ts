import { Application } from "express";
import authRoutes from "./auth.routes";
import portalRoutes from "./portal.routes";
import contactRoutes from "./contact.routes";
import portfolioRoutes from "./portfolio.routes";
import leadsRoutes from "./leads.routes";
import chatbotRoutes from "./chatbot.routes";
import analyticsRoutes from "./analytics.routes";
import toolsRoutes from "./tools.routes";
// import emailRoutes from "./email.routes"; // If needed
import socialRoutes from "./social.routes";

export const registerRoutes = (app: Application) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/portal", portalRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/portfolio", portfolioRoutes);
  app.use("/api/admin/enquiries", leadsRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/tools", toolsRoutes);
  app.use("/api/social", socialRoutes);
};