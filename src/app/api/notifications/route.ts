import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET() {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: auth.session.accountId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: auth.session.accountId, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Notifications Fetch Error:", error);
    return jsonError("Failed to fetch notifications.", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  const title = stringValue(body.title, 150);
  const description = stringValue(body.description, 500);
  const type = stringValue(body.type, 50);
  const senderId = Number(body.senderId) || auth.session.accountId;
  const messageId = body.messageId ? Number(body.messageId) : null;

  if (!title || !description || !type) {
    return jsonError("Title, description, and type are required.");
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId: auth.session.accountId,
        senderId,
        messageId,
        title,
        description,
        type,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Notification Create Error:", error);
    return jsonError("Failed to create notification.", 500);
  }
}
