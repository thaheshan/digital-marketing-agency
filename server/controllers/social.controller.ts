import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getSocialStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, {
      platforms: [
        { name: "Facebook", connected: false },
        { name: "Instagram", connected: false },
        { name: "TikTok", connected: false },
        { name: "LinkedIn", connected: false }
      ]
    });
  } catch (e) { err(next, e); }
};

export const getRecentPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, { posts: [] });
  } catch (e) { err(next, e); }
};
