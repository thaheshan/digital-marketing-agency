import { Request, Response, NextFunction } from "express";
import * as chatbotService from "../services/chatbot/chatbot.service";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const processMessage = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await chatbotService.processMessage(req.body) as unknown as object); } catch (e) { err(next, e); }
};
export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { sessions: await chatbotService.getSessions() }); } catch (e) { err(next, e); }
};
export const getSessionDetail = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { session: await chatbotService.getSessionDetail(req.params.id as string) }); } catch (e) { err(next, e); }
};
export const getKnowledgeBase = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { knowledge: await chatbotService.getKnowledgeBase() }); } catch (e) { err(next, e); }
};
export const updateKnowledgeBaseItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { item: await chatbotService.updateKnowledgeBaseItem(req.params.id as string, req.body) }); } catch (e) { err(next, e); }
};
