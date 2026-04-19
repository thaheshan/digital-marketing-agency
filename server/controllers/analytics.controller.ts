import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics/analytics.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getOverview();
    ok(res, data);
  } catch (e) {
    err(next, e);
  }
};

export const getCampaignAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getCampaignAnalytics(req.params.id);
    ok(res, data);
  } catch (e) {
    err(next, e);
  }
};

export const getContentPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getContentPerformance();
    ok(res, data);
  } catch (e) {
    err(next, e);
  }
};
