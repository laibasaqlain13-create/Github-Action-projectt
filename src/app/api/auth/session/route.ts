import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  readSessionToken,
  sessionCookieName,
} from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = cookies();

    const token = cookieStore.get(sessionCookieName)?.value;

    const session = readSessionToken(token);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.role === "ARTISAN") {
      const artisan = await prisma.artisan.findUnique({
        where: {
          id: session.accountId,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      });

      if (!artisan) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        user: {
          ...artisan,
          role: "ARTISAN",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.accountId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Session Error:", error);

    return NextResponse.json(
      { error: "Unable to verify session." },
      { status: 500 }
    );
  }
}