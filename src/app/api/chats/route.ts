import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession } from "@/lib/api";

export async function GET() {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  try {
    const { role, accountId } = auth.session;

    let chats;

    if (role === "CUSTOMER") {
      chats = await prisma.chat.findMany({
        where: { customerId: accountId },
        include: {
          artisan: {
            select: { id: true, fullName: true, businessName: true, profileImage: true },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { id: true, message: true, createdAt: true, isRead: true },
          },
          _count: {
            select: {
              messages: { where: { receiverId: accountId, isRead: false } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // ARTISAN
      chats = await prisma.chat.findMany({
        where: { artisanId: accountId },
        include: {
          customer: {
            select: { id: true, fullName: true, email: true },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { id: true, message: true, createdAt: true, isRead: true },
          },
          _count: {
            select: {
              messages: { where: { receiverId: accountId, isRead: false } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Chats Fetch Error:", error);
    return jsonError("Failed to fetch chats.", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["CUSTOMER", "ARTISAN"]);
  if ("error" in auth) return auth.error;

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  const artisanId = Number(body.artisanId);

  if (!artisanId) {
    return jsonError("Artisan ID is required.");
  }

  try {
    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        customerId: auth.session.accountId,
        artisanId,
      },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    const chat = await prisma.chat.create({
      data: {
        customerId: auth.session.accountId,
        artisanId,
      },
      include: {
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Chat Create Error:", error);
    return jsonError("Failed to create chat.", 500);
  }
}
