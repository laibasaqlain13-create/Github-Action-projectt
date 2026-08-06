import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession } from "@/lib/api";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid notification id.");

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return jsonError("Notification not found.", 404);
    if (notification.userId !== auth.session.accountId) {
      return jsonError("Unauthorized to update this notification.", 403);
    }

    const data: Record<string, unknown> = {};
    if (body.isRead !== undefined) data.isRead = Boolean(body.isRead);

    const updated = await prisma.notification.update({
      where: { id },
      data,
    });

    return NextResponse.json({ notification: updated });
  } catch (error) {
    console.error("Notification Update Error:", error);
    return jsonError("Failed to update notification.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid notification id.");

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return jsonError("Notification not found.", 404);
    if (notification.userId !== auth.session.accountId) {
      return jsonError("Unauthorized to delete this notification.", 403);
    }

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Notification Delete Error:", error);
    return jsonError("Failed to delete notification.", 500);
  }
}
