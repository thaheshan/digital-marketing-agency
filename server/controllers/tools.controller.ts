import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as roiService from "../services/tools/roi.service";
import * as toolsService from "../services/tools/tools.service";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

const roiSchema = z.object({
  industry:              z.string().min(1),
  monthlyRevenuePence:   z.number().positive(),
  conversionRateX100:    z.number().positive(),
  monthlyTraffic:        z.number().positive(),
  monthlyBudgetPence:    z.number().positive(),
  targetRevenueIncrease: z.number().default(25),
  conversionRateGoal:    z.number().default(400),
  timeframeMonths:       z.number().refine(v => [3, 6, 12].includes(v), {
    message: "timeframeMonths must be 3, 6, or 12"
  }).default(6),
  marketingFocus:        z.string().optional(),
  additionalBudgetPence: z.number().optional(),
  targetConversionRate:  z.number().optional(),
  primaryPriority:       z.string().optional(),
  firstName:             z.string().min(1),
  lastName:              z.string().min(1),
  email:                 z.string().email(),
  phone:                 z.string().optional(),
  visitorId:             z.string().uuid().optional(),
});

export const calculateRoi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input  = roiSchema.parse(req.body);
    const result = await roiService.calculateRoi(input);
    ok(res, result, 201);
  } catch (e) { err(next, e); }
};

export const getRoiResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await roiService.getRoiResult(req.params.id);
    ok(res, { result });
  } catch (e) { err(next, e); }
};

export const runAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.runAudit(req.body.url);
    ok(res, result);
  } catch (e) { err(next, e); }
};

export const evaluateSentiment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.evaluateSentiment(req.body.text);
    ok(res, result);
  } catch (e) { err(next, e); }
};

export const getPersonalization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toolsService.getPersonalization(req.body.visitor_type);
    ok(res, result);
  } catch (e) { err(next, e); }
};