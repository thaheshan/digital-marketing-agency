import { Application } from "express";
import authRoutes   from "./auth.routes";
import portalRoutes from "./portal.routes";
import toolsRoutes  from "./tools.routes";

export const registerRoutes = (app: Application) => {
  app.use("/api/auth",   authRoutes);
  app.use("/api/portal", portalRoutes);
  app.use("/api/tools",  toolsRoutes);
};
