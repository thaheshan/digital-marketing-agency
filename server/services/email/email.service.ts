import nodemailer from "nodemailer";
import { env } from "../../config/env.config";

// Development fallback logger
const devEmailLogger = (to: string, subject: string, otp: string) => {
  console.log("-----------------------------------------");
  console.log(`[DEV EMAIL] To: ${to}`);
  console.log(`[DEV EMAIL] Subject: ${subject}`);
  console.log(`[DEV EMAIL] OTP CODE: ${otp}`);
  console.log("-----------------------------------------");
};

const transporter = (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) 
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

export const sendOtpEmail = async (to: string, otp: string, firstName: string) => {
  if (!transporter) {
    devEmailLogger(to, "Verify your email — OTP Code", otp);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Digital Marketing Agency" <${env.SMTP_USER}>`,
      to,
      subject: "Verify your email — OTP Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#1e40af">Verify Your Email</h2>
          <p>Hi ${firstName},</p>
          <p>Your verification code is:</p>
          <div style="background:#f1f5f9;padding:20px;text-align:center;border-radius:8px;margin:20px 0">
            <h1 style="color:#1e40af;letter-spacing:8px;font-size:36px">${otp}</h1>
          </div>
          <p>This code expires in <strong>15 minutes</strong>.</p>
        </div>`,
    });
  } catch (error) {
    console.error("[Email Service] Failed to send OTP email:", error);
    // Fallback to console so dev isn't blocked
    devEmailLogger(to, "Verify your email — OTP Code", otp);
  }
};

export const sendPasswordResetEmail = async (to: string, resetToken: string, firstName: string) => {
  const resetUrl = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
  
  if (!transporter) {
    console.log(`[DEV EMAIL] Reset Password Link for ${to}: ${resetUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Digital Marketing Agency" <${env.SMTP_USER}>`,
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#1e40af">Reset Your Password</h2>
          <p>Hi ${firstName},</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${resetUrl}" style="background:#1e40af;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:bold">Reset Password</a>
          </div>
          <p>This link expires in <strong>1 hour</strong>.</p>
        </div>`,
    });
  } catch (error) {
    console.error("[Email Service] Failed to send reset email:", error);
  }
};
