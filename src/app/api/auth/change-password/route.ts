import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("hunarconnect-session");

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "You must be logged in to change your password." },
        { status: 401 }
      );
    }

    // Parse session from the cookie value (payload.signature format)
    const tokenParts = sessionCookie.value.split(".");
    if (tokenParts.length !== 2) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    let sessionPayload: { accountId: number; role: string };
    try {
      sessionPayload = JSON.parse(
        Buffer.from(tokenParts[0], "base64url").toString("utf8")
      );
    } catch {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password." },
        { status: 400 }
      );
    }

    const role = sessionPayload.role as string;
    const accountId = sessionPayload.accountId;

    if (role === "CUSTOMER") {
      const user = await prisma.user.findUnique({
        where: { id: accountId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found." },
          { status: 404 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 403 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: accountId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({
        message: "Password changed successfully.",
      });
    }

    if (role === "ARTISAN") {
      const artisan = await prisma.artisan.findUnique({
        where: { id: accountId },
      });

      if (!artisan) {
        return NextResponse.json(
          { error: "Artisan not found." },
          { status: 404 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, artisan.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 403 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.artisan.update({
        where: { id: accountId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({
        message: "Password changed successfully.",
      });
    }

    return NextResponse.json(
      { error: "Invalid user role." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { error: "Failed to change password." },
      { status: 500 }
    );
  }
}

