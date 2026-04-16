import { Request, Response, NextFunction } from "express";
const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string") clean[key] = val.replace(/[<>]/g, "").trim();
    else if (val && typeof val === "object" && !Array.isArray(val)) clean[key] = sanitize(val as Record<string, unknown>);
    else clean[key] = val;
  }
  return clean;
};
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object") req.body = sanitize(req.body);
  next();
};
