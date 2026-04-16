import crypto from "crypto";
import prisma from "../../db/prisma";
import { hashPassword, comparePassword } from "./bcrypt.service";
import { generateTokens } from "./jwt.service";
import { sendOtpEmail, sendPasswordResetEmail } from "../email/email.service";
import { RegisterInput, LoginInput } from "../../validators/auth/auth.validator";

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await hashPassword(input.password);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await prisma.user.create({
    data: {
      email: input.email, passwordHash,
      firstName: input.firstName, lastName: input.lastName,
      phone: input.phone, role: "client", status: "pending_verification", emailVerified: false,
    },
  });

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id, otpCode: otp,
      linkToken: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await sendOtpEmail(user.email, otp, user.firstName);

  return { message: "Registration successful. Check your email for OTP.", userId: user.id, email: user.email };
};

export const verifyEmail = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = await prisma.emailVerificationToken.findFirst({
    where: { userId: user.id, verified: false }, orderBy: { createdAt: "desc" },
  });

  if (!token) throw new Error("No pending verification found");
  if (token.expiresAt < new Date()) throw new Error("OTP expired");
  if (token.attempts >= 3) throw new Error("Too many attempts");
  if (token.otpCode !== otp) {
    await prisma.emailVerificationToken.update({ where: { id: token.id }, data: { attempts: { increment: 1 } } });
    throw new Error("Invalid OTP");
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({ where: { id: token.id }, data: { verified: true } }),
    prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, status: "active" } }),
  ]);

  return { message: "Email verified successfully" };
};

export const login = async (input: LoginInput, ipAddress?: string, userAgent?: string) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Invalid email or password");
  if (user.lockedUntil && user.lockedUntil > new Date()) throw new Error("Account locked. Try again later");
  if (!user.emailVerified) throw new Error("Please verify your email first");
  if (user.status !== "active") throw new Error("Account is not active");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    const failCount = user.failedLoginCount + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: failCount, lockedUntil: failCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null },
    });
    throw new Error("Invalid email or password");
  }

  const session = await prisma.session.create({
    data: { userId: user.id, portal: user.role === "client" ? "client" : "staff", ipAddress: ipAddress ?? null, userAgent: userAgent ?? null, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) },
  });

  await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() } });

  const tokens = generateTokens({ userId: user.id, role: user.role, sessionId: session.id });

  return { ...tokens, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status } };
};

export const logout = async (sessionId: string) => {
  await prisma.session.update({ where: { id: sessionId }, data: { revoked: true } });
  return { message: "Logged out successfully" };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true, emailVerified: true, phone: true, profilePhotoUrl: true, createdAt: true },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: "If that email exists, a reset link has been sent" };

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({ data: { userId: user.id, token: hashedToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
  await sendPasswordResetEmail(email, rawToken, user.firstName);

  return { message: "If that email exists, a reset link has been sent" };
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: hashedToken } });

  if (!resetToken || resetToken.used) throw new Error("Invalid or expired token");
  if (resetToken.expiresAt < new Date()) throw new Error("Token expired");

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
  ]);

  return { message: "Password reset successful" };
};
