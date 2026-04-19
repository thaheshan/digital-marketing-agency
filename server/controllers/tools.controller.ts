import { Request, Response, NextFunction } from "express";
import * as toolsService from "../services/tools/tools.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const calculateRoi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.calculateRoi(req.body);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};

export const runAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.runAudit(req.body.url);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};

export const evaluateSentiment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.evaluateSentiment(req.body.text);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};

export const getPersonalization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.getPersonalization(req.body.visitor_type);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};
