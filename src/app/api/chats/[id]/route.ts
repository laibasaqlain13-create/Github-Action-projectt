import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, requireSession } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  try {
    const id = parseId(params.id);
    if (!id) return jsonError("Invalid chat id.");

    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, fullName: true, email: true } },
        artisan: {
          select: { id: true, fullName: true, businessName: true, profileImage: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            senderId: true,
            receiverId: true,
            message: true,
            isRead: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chat) return jsonError("Chat not found.", 404);

    const { role, accountId } = auth.session;
    if (
      !(role === "CUSTOMER" && chat.customerId === accountId) &&
      !(role === "ARTISAN" && chat.artisanId === accountId)
    ) {
      return jsonError("Unauthorized to view this chat.", 403);
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Chat Fetch Error:", error);
    return jsonError("Failed to fetch chat.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid chat id.");

  try {
    const chat = await prisma.chat.findUnique({ where: { id } });
    if (!chat) return jsonError("Chat not found.", 404);

    const { role, accountId } = auth.session;
    if (
      !(role === "CUSTOMER" && chat.customerId === accountId) &&
      !(role === "ARTISAN" && chat.artisanId === accountId)
    ) {
      return jsonError("Unauthorized to delete this chat.", 403);
    }

    await prisma.chat.delete({ where: { id } });
    return NextResponse.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Chat Delete Error:", error);
    return jsonError("Failed to delete chat.", 500);
  }
}
