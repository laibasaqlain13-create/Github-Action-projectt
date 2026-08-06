import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Email, reset token, and new password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (transaction) => {
      const resetRequest = await transaction.passwordReset.findFirst({
        where: {
          resetToken: token,
          isUsed: false,
          expiryTime: { gt: new Date() },
        },
      });

      if (!resetRequest) return false;

      if (resetRequest.userId) {
        const user = await transaction.user.findUnique({
          where: { id: resetRequest.userId },
          select: { email: true },
        });

        if (!user || user.email.toLowerCase() !== email) return false;

        await transaction.user.update({
          where: { id: resetRequest.userId },
          data: { password: passwordHash },
        });
      } else if (resetRequest.artisanId) {
        const artisan = await transaction.artisan.findUnique({
          where: { id: resetRequest.artisanId },
          select: { email: true },
        });

        if (!artisan || artisan.email.toLowerCase() !== email) return false;

        await transaction.artisan.update({
          where: { id: resetRequest.artisanId },
          data: { password: passwordHash },
        });
      } else {
        throw new Error("Password reset request has no account.");
      }

      await transaction.passwordReset.update({
        where: { id: resetRequest.id },
        data: { isUsed: true },
      });

      return true;
    });

    if (!result) {
      return NextResponse.json({ error: "This reset link is invalid, expired, or has already been used." }, { status: 400 });
    }

    return NextResponse.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
