import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Analytics dashboard - coming soon" }); } catch (e) { err(next, e); }
};

export const getCampaignAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Campaign analytics - coming soon" }); } catch (e) { err(next, e); }
};

export const getSnapshot = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Snapshot - coming soon" }); } catch (e) { err(next, e); }
};
