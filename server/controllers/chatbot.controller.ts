import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Chatbot - coming soon" }); } catch (e) { err(next, e); }
};

export const getSession = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string }); } catch (e) { err(next, e); }
};

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { sessions: [] }); } catch (e) { err(next, e); }
};

export const getKnowledgeBase = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { items: [] }); } catch (e) { err(next, e); }
};

export const createKnowledgeBaseItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Created" }, 201); } catch (e) { err(next, e); }
};

export const updateKnowledgeBaseItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string }); } catch (e) { err(next, e); }
};

export const deleteKnowledgeBaseItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Deleted" }); } catch (e) { err(next, e); }
};
