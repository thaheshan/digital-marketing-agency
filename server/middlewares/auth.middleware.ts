import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import prisma from "../db/prisma";

interface AuthRequest extends Request { userId?: string; role?: string; sessionId?: string; }

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) { res.status(401).json({ success: false, error: "No token provided" }); return; }
    const token = header.split(" ")[1];
    const payload = verifyAccessToken(token);
    const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
    if (!session || session.revoked || session.expiresAt < new Date()) { res.status(401).json({ success: false, error: "Session expired" }); return; }
    req.userId = payload.userId; req.role = payload.role; req.sessionId = payload.sessionId;
    next();
  } catch { res.status(401).json({ success: false, error: "Invalid token" }); }
};

export const requireRole = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.role || !roles.includes(req.role)) { res.status(403).json({ success: false, error: "Insufficient permissions" }); return; }
  next();
};
