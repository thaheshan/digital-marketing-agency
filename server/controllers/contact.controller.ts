import { Request, Response, NextFunction } from "express";
import * as contactService from "../services/contact/contact.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const submitEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await contactService.submitEnquiry(req.body);
    ok(res, result, 201);
  } catch (e) {
    err(next, e);
  }
};

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";
    const result = await contactService.trackVisitor(req.body, ip, userAgent);
    ok(res, result, 200);
  } catch (e) {
    err(next, e);
  }
};
