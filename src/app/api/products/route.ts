import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artisanId = searchParams.get("artisanId");
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (artisanId) where.artisanId = Number(artisanId);
    if (categoryId) where.categoryId = Number(categoryId);

    const products = await prisma.product.findMany({
      where,
      include: {
        artisan: { select: { id: true, fullName: true, businessName: true } },
        category: { select: { id: true, categoryName: true, categorySlug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products Fetch Error:", error);
    return jsonError("Failed to fetch products.", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["ARTISAN"]);
  if ("error" in auth) return auth.error;

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  const artisanId = auth.session.accountId;
  const productName = stringValue(body.productName, 150);
  const categoryId = Number(body.categoryId);
  const price = Number(body.price);
  const description = stringValue(body.description, 2000);
  const image = stringValue(body.image, 500);

  if (!productName || !categoryId || !price) {
    return jsonError("Product name, category, and price are required.");
  }

  try {
    const product = await prisma.product.create({
      data: {
        artisanId,
        categoryId,
        productName,
        description: description || null,
        price,
        image: image || null,
      },
      include: {
        category: { select: { id: true, categoryName: true } },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product Create Error:", error);
    return jsonError("Failed to create product.", 500);
  }
}
