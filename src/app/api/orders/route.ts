import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession } from "@/lib/api";

export async function GET(request: NextRequest) {
  const auth = requireSession(["CUSTOMER", "ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const { role, accountId } = auth.session;

    let orders;

    if (role === "CUSTOMER") {
      orders = await prisma.order.findMany({
        where: { customerId: accountId },
        include: {
          product: {
            select: { id: true, productName: true, price: true, image: true },
          },
          artisan: {
            select: { id: true, fullName: true, businessName: true },
          },
        },
        orderBy: { orderDate: "desc" },
      });
    } else if (role === "ARTISAN") {
      const statusFilter = searchParams.get("status");
      const where: Record<string, unknown> = { artisanId: accountId };
      if (statusFilter) where.status = statusFilter;

      orders = await prisma.order.findMany({
        where,
        include: {
          product: {
            select: { id: true, productName: true, price: true, image: true },
          },
          customer: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
        },
        orderBy: { orderDate: "desc" },
      });
    } else {
      // ADMIN
      orders = await prisma.order.findMany({
        include: {
          product: {
            select: { id: true, productName: true, price: true },
          },
          customer: {
            select: { id: true, fullName: true, email: true },
          },
          artisan: {
            select: { id: true, fullName: true, businessName: true },
          },
        },
        orderBy: { orderDate: "desc" },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return jsonError("Failed to fetch orders.", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["CUSTOMER"]);
  if ("error" in auth) return auth.error;

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  const productId = Number(body.productId);
  const artisanId = Number(body.artisanId);

  if (!productId || !artisanId) {
    return jsonError("Product ID and Artisan ID are required.");
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return jsonError("Product not found.", 404);

    const order = await prisma.order.create({
      data: {
        customerId: auth.session.accountId,
        artisanId,
        productId,
        status: "PENDING",
      },
      include: {
        product: { select: { id: true, productName: true, price: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order Create Error:", error);
    return jsonError("Failed to create order.", 500);
  }
}
