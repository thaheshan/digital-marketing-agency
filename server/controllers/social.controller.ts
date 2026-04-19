import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { feed: [], message: "Social feed - coming soon" }); } catch (e) { err(next, e); }
};
