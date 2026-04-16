import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth/auth.service";
import { registerSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth/auth.validator";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await authService.register(registerSchema.parse(req.body)), 201); } catch (e) { err(next, e); }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await authService.login(loginSchema.parse(req.body), req.ip, req.headers["user-agent"])); } catch (e) { err(next, e); }
};
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, await authService.logout((req as Request & { sessionId?: string }).sessionId!)); } catch (e) { err(next, e); }
};
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try { ok(res, { user: await authService.getMe((req as Request & { userId?: string }).userId!) }); } catch (e) { err(next, e); }
};
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try { const { email, otp } = verifyOtpSchema.parse(req.body); ok(res, await authService.verifyEmail(email, otp)); } catch (e) { err(next, e); }
};
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try { const { email } = forgotPasswordSchema.parse(req.body); ok(res, await authService.forgotPassword(email)); } catch (e) { err(next, e); }
};
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try { const { token, password } = resetPasswordSchema.parse(req.body); ok(res, await authService.resetPassword(token, password)); } catch (e) { err(next, e); }
};
