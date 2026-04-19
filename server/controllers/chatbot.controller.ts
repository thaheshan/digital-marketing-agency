import { Request, Response, NextFunction } from "express";
import * as chatbotService from "../services/chatbot/chatbot.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const processMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await chatbotService.processMessage(req.body);
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await chatbotService.getSessions();
    ok(res, { sessions });
  } catch (e) {
    err(next, e);
  }
};

export const getSessionDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await chatbotService.getSessionDetail(req.params.id);
    ok(res, { session });
  } catch (e) {
    err(next, e);
  }
};

export const getKnowledgeBase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const knowledge = await chatbotService.getKnowledgeBase();
    ok(res, { knowledge });
  } catch (e) {
    err(next, e);
  }
};

export const updateKnowledgeBaseItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await chatbotService.updateKnowledgeBaseItem(req.params.id, req.body);
    ok(res, { item });
  } catch (e) {
    err(next, e);
  }
};
