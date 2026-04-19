import { Request, Response, NextFunction } from "express";
import * as leadsService from "../services/leads/leads.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, temp } = req.query;
    const enquiries = await leadsService.getEnquiries(status as string, temp as string);
    ok(res, { enquiries });
  } catch (e) {
    err(next, e);
  }
};

export const getEnquiryDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enquiry = await leadsService.getEnquiryDetail(req.params.id);
    ok(res, { enquiry });
  } catch (e) {
    err(next, e);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { status } = req.body;
    const enquiry = await leadsService.updateStatus(req.params.id, status, userId);
    ok(res, { enquiry });
  } catch (e) {
    err(next, e);
  }
};

export const convertEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const result = await leadsService.convertToClient(req.params.id, userId);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};

export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { noteText } = req.body;
    const note = await leadsService.addNote(req.params.id, userId, noteText);
    ok(res, { note }, 201);
  } catch (e) {
    err(next, e);
  }
};
