import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully.",
  });

  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}