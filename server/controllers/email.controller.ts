import { Request, Response, NextFunction } from "express";
import { sendOtpEmail } from "../services/email/email.service";
import { env } from "../config/env.config";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simple check if SMTP config is present
    const configured = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
    ok(res, { configured, host: env.SMTP_HOST });
  } catch (e) { err(next, e); }
};

export const sendTestEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email is required");
    
    await sendOtpEmail(email, "123456", "Test User");
    ok(res, { message: `Test email sent to ${email}` });
  } catch (e) { err(next, e); }
};
