import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const [user, artisan] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.artisan.findUnique({ where: { email }, select: { id: true } }),
    ]);

    if (!user && !artisan) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 }
      );
    }

    const resetToken = randomBytes(32).toString("hex");
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.$transaction(async (transaction) => {
      // Only the latest request for this account remains valid.
      await transaction.passwordReset.deleteMany({
        where: user ? { userId: user.id } : { artisanId: artisan!.id },
      });

      await transaction.passwordReset.create({
        data: {
          userId: user?.id,
          artisanId: artisan?.id,
          resetToken,
          expiryTime,
        },
      });
    });

    return NextResponse.json({
      message: "Password reset link generated successfully.",
      // Until email delivery is configured, the client uses this token to open
      // the reset form immediately.
      token: resetToken,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
