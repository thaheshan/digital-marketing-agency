import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { enquiries: [] }); } catch (e) { err(next, e); }
};

export const getEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string }); } catch (e) { err(next, e); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Status updated" }); } catch (e) { err(next, e); }
};

export const convertToClient = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Converted to client" }); } catch (e) { err(next, e); }
};

export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Note added" }, 201); } catch (e) { err(next, e); }
};

export const getScoreFactors = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { factors: [] }); } catch (e) { err(next, e); }
};
