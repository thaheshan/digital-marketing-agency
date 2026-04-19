import { Request, Response, NextFunction } from "express";
import * as portfolioService from "../services/portfolio/portfolio.service";

const ok = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getPublishedPortfolioItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await portfolioService.getPublishedItems();
    ok(res, { items });
  } catch (e) {
    err(next, e);
  }
};

export const getPublishedItemBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await portfolioService.getItemBySlug(req.params.slug);
    ok(res, { item });
  } catch (e) {
    err(next, e);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const item = await portfolioService.createItem(req.body, userId);
    ok(res, { item }, 201);
  } catch (e) {
    err(next, e);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await portfolioService.updateItem(req.params.id, req.body);
    ok(res, { item });
  } catch (e) {
    err(next, e);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await portfolioService.deleteItem(req.params.id);
    ok(res, { message: "Deleted successfully" });
  } catch (e) {
    err(next, e);
  }
};

export const generateDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    let result;
    if (id && id !== "draft") {
      result = await portfolioService.generateDescription(id, req.body);
    } else {
      result = await portfolioService.generateDraftDescription(req.body);
    }
    ok(res, result);
  } catch (e) {
    err(next, e);
  }
};
