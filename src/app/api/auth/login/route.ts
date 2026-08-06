import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check Customer
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        message: "Login successful.",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });

      response.cookies.set(
        sessionCookieName,
        createSessionToken(user.id, user.role),
        sessionCookieOptions
      );

      return response;
    }

    // Check Artisan
    const artisan = await prisma.artisan.findUnique({
      where: { email },
    });

    if (artisan) {
      const validPassword = await bcrypt.compare(
        password,
        artisan.password
      );

      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        message: "Login successful.",
        user: {
          id: artisan.id,
          fullName: artisan.fullName,
          email: artisan.email,
          role: "ARTISAN",
        },
      });

      response.cookies.set(
        sessionCookieName,
        createSessionToken(artisan.id, "ARTISAN"),
        sessionCookieOptions
      );

      return response;
    }

    return NextResponse.json(
      { error: "No account was found for this email. Please register first." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
