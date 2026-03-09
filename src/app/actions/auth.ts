"use server"

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string) {
  try {
    // 1. Verify User Exists
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      throw new Error("If an account exists with this email, a reset link has been sent.");
    }

    // 2. Generate Secure Token (UUID v4 style)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 Hour from now

    // 3. Save to Database (Delete old tokens for this email first)
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    // 4. Send Email via Resend
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Amaze Ayurveda Security <security@amazeayurveda.in>",
      to: email,
      subject: "Action Required: Reset Your Password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px;">
          <h1 style="color: #0f172a; font-style: italic;">Amaze Ayurveda</h1>
          <p style="color: #64748b; font-size: 16px;">Hello ${user.name || 'Associate'},</p>
          <p style="color: #475569;">A password reset was requested for your partner account. Click the button below to secure your account:</p>
          <a href="${resetLink}" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    });

    return { success: true };
  } catch (error: any) {
    console.error("RESET_ERROR:", error);
    return { error: error.message };
  }
}

export async function updatePassword(token: string, newPassword: string) {
  try {
    // 1. Token ko database mein find karein
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      throw new Error("Invalid or expired token.");
    }

    // 2. Check karein ki token expire toh nahi ho gaya
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      await prisma.passwordResetToken.delete({ where: { token } });
      throw new Error("Token has expired. Please request a new link.");
    }

    // 3. New password ko hash karein
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 4. Database update (Atomic Transaction)
    // Hum user ka password update karenge aur saath hi token delete kar denge
    await prisma.$transaction([
      prisma.user.updateMany({
        where: { email: existingToken.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { token }
      })
    ]);

    return { success: true, message: "Password updated successfully!" };
  } catch (error: any) {
    console.error("UPDATE_PASSWORD_ERROR:", error);
    return { error: error.message || "Something went wrong." };
  }
}