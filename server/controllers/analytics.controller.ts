import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics/analytics.service";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await analyticsService.getOverview() as unknown as object); } catch (e) { err(next, e); }
};
export const getCampaignAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await analyticsService.getCampaignAnalytics(req.params.id as string) as unknown as object); } catch (e) { err(next, e); }
};
export const getContentPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await analyticsService.getContentPerformance() as unknown as object); } catch (e) { err(next, e); }
};
