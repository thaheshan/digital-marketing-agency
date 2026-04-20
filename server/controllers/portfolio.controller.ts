import { Request, Response, NextFunction } from "express";
import * as portfolioService from "../services/portfolio/portfolio.service";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getPublishedPortfolioItems = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { items: await portfolioService.getPublishedItems() }); } catch (e) { err(next, e); }
};
export const getPublishedItemBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { item: await portfolioService.getItemBySlug(req.params.slug as string) }); } catch (e) { err(next, e); }
};
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try { const userId = (req as any).userId; ok(res, { item: await portfolioService.createItem(req.body, userId) }, 201); } catch (e) { err(next, e); }
};
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { item: await portfolioService.updateItem(req.params.id as string, req.body) }); } catch (e) { err(next, e); }
};
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try { await portfolioService.deleteItem(req.params.id as string); ok(res, { message: "Deleted successfully" }); } catch (e) { err(next, e); }
};
export const generateDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const result = id && id !== "draft"
      ? await portfolioService.generateDescription(id, req.body)
      : await portfolioService.generateDraftDescription(req.body);
    ok(res, result as unknown as object);
  } catch (e) { err(next, e); }
};
