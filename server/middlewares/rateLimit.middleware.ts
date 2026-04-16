import rateLimit from "express-rate-limit";
export const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, error: "Too many attempts." }, skipSuccessfulRequests: true });
export const globalRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, error: "Too many requests." } });
