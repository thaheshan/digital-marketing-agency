import { Request, Response, NextFunction } from "express";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { items: [] }); } catch (e) { err(next, e); }
};

export const getItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { slug: req.params.slug as string }); } catch (e) { err(next, e); }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Portfolio item created" }, 201); } catch (e) { err(next, e); }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Updated" }); } catch (e) { err(next, e); }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { message: "Deleted" }); } catch (e) { err(next, e); }
};

export const generateDescription = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { id: req.params.id as string, message: "Description generation - coming soon" }); } catch (e) { err(next, e); }
};

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { testimonials: [] }); } catch (e) { err(next, e); }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { services: [] }); } catch (e) { err(next, e); }
};
