import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]`, err.message);
  if (err instanceof ZodError) {
    res.status(400).json({ success: false, error: "Validation failed", details: (err as ZodError).issues.map((e: ZodIssue) => ({ field: e.path.join("."), message: e.message })) });
    return;
  }
  const message = err.message || "Internal server error";
  const status = message.includes("not found") ? 404 : message.includes("unauthorized") ? 401 : message.includes("Invalid") ? 400 : message.includes("already") ? 409 : 500;
  res.status(status).json({ success: false, error: message });
};
