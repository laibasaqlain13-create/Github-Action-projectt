import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireSession } from "@/lib/api";

export async function GET() {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  try {
    const { accountId, role } = auth.session;
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: accountId,
        isRead: false,
        chat: role === "CUSTOMER" ? { customerId: accountId } : { artisanId: accountId },
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Unread message count error:", error);
    return jsonError("Failed to fetch unread message count.", 500);
  }
}
