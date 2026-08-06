import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  try {
    const chatId = parseId(params.id);
    if (!chatId) return jsonError("Invalid chat id.");

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return jsonError("Chat not found.", 404);

    const { role, accountId } = auth.session;
    if (
      !(role === "CUSTOMER" && chat.customerId === accountId) &&
      !(role === "ARTISAN" && chat.artisanId === accountId)
    ) {
      return jsonError("Unauthorized to view messages.", 403);
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        chatId,
        receiverId: accountId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages Fetch Error:", error);
    return jsonError("Failed to fetch messages.", 500);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  try {
    const chatId = parseId(params.id);
    if (!chatId) return jsonError("Invalid chat id.");

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return jsonError("Chat not found.", 404);

    const { role, accountId } = auth.session;
    if (
      !(role === "CUSTOMER" && chat.customerId === accountId) &&
      !(role === "ARTISAN" && chat.artisanId === accountId)
    ) {
      return jsonError("Unauthorized to send messages.", 403);
    }

    const body = await readBody(request);
    if (!body) return jsonError("Invalid request body.");

    const messageText = stringValue(body.message, 4000);
    if (!messageText) return jsonError("Message is required.");

    // Determine receiver
    const receiverId = role === "CUSTOMER" ? chat.artisanId : chat.customerId;

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: accountId,
        receiverId,
        message: messageText,
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Message Create Error:", error);
    return jsonError("Failed to send message.", 500);
  }
}
