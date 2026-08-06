import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const id = parseId(params.id);
    if (!id) return jsonError("Invalid order id.");

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, productName: true, description: true, price: true, image: true },
        },
        customer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        artisan: {
          select: { id: true, fullName: true, businessName: true, email: true, phone: true },
        },
      },
    });

    if (!order) return jsonError("Order not found.", 404);

    // Authorization check
    const { role, accountId } = auth.session;
    if (
      role !== "ADMIN" &&
      !(role === "CUSTOMER" && order.customerId === accountId) &&
      !(role === "ARTISAN" && order.artisanId === accountId)
    ) {
      return jsonError("Unauthorized to view this order.", 403);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return jsonError("Failed to fetch order.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid order id.");

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return jsonError("Order not found.", 404);

    if (auth.session.role === "ARTISAN" && order.artisanId !== auth.session.accountId) {
      return jsonError("Unauthorized to update this order.", 403);
    }

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const newStatus = String(body.status).toUpperCase();

    if (!validStatuses.includes(newStatus)) {
      return jsonError("Invalid order status.", 400);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: newStatus as any },
      include: {
        product: { select: { id: true, productName: true, price: true } },
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error("Order Update Error:", error);
    return jsonError("Failed to update order.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid order id.");

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return jsonError("Order not found.", 404);

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Order Delete Error:", error);
    return jsonError("Failed to delete order.", 500);
  }
}
