import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSessionToken, sessionCookieName, type SessionPayload } from "@/lib/session";

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export function getSession(): SessionPayload | null {
  return readSessionToken(cookies().get(sessionCookieName)?.value);
}

export function requireSession(roles?: SessionPayload["role"][]) {
  const session = getSession();
  if (!session) return { error: jsonError("Unauthorized.", 401) } as const;
  if (roles && !roles.includes(session.role)) return { error: jsonError("Forbidden.", 403) } as const;
  return { session } as const;
}

export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
}

export function stringValue(value: unknown, maxLength?: number) {
  if (typeof value !== "string") return "";
  const result = value.trim();
  return maxLength && result.length > maxLength ? "" : result;
}
