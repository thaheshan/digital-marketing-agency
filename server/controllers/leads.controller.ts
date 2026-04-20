import { Request, Response, NextFunction } from "express";
import * as leadsService from "../services/leads/leads.service";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try { const { status, temp } = req.query; ok(res, { enquiries: await leadsService.getEnquiries(status as string, temp as string) }); } catch (e) { err(next, e); }
};
export const getEnquiryDetail = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { enquiry: await leadsService.getEnquiryDetail(req.params.id as string) }); } catch (e) { err(next, e); }
};
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try { const userId = (req as any).userId; ok(res, { enquiry: await leadsService.updateStatus(req.params.id as string, req.body.status, userId) }); } catch (e) { err(next, e); }
};
export const convertEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try { const userId = (req as any).userId; ok(res, await leadsService.convertToClient(req.params.id as string, userId) as unknown as object); } catch (e) { err(next, e); }
};
export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try { const userId = (req as any).userId; ok(res, { note: await leadsService.addNote(req.params.id as string, userId, req.body.noteText) }, 201); } catch (e) { err(next, e); }
};
