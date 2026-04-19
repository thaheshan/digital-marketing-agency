import { Request, Response } from "express";

export const param = (req: Request, key: string): string =>
  Array.isArray(req.params[key]) ? req.params[key][0] : req.params[key] as string;

export const ok = (res: Response, data: object, status = 200) =>
  res.status(status).json({ success: true, ...data });
