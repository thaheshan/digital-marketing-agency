import { Application } from "express";
import authRoutes from "./auth.routes";
export const registerRoutes = (app: Application) => {
  app.use("/api/auth", authRoutes);
};
