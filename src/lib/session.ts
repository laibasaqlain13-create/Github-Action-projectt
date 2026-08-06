import crypto from "node:crypto";

type SessionRole = "CUSTOMER" | "ARTISAN" | "ADMIN";

export type SessionPayload = {
  accountId: number;
  role: SessionRole;
  expiresAt: number;
};

const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

function sessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET must be configured in production.");
  }
  return "development-only-session-secret-change-before-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(accountId: number, role: SessionRole) {
  const payload: SessionPayload = { accountId, role, expiresAt: Date.now() + sessionDurationMs };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readSessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    if (!Number.isInteger(payload.accountId) || !["CUSTOMER", "ARTISAN", "ADMIN"].includes(payload.role) || payload.expiresAt <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieName = "hunarconnect-session";
export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: Math.floor(sessionDurationMs / 1000),
};
