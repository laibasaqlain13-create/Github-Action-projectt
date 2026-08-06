import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    if (!id) return jsonError("Invalid product id.");

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        artisan: { select: { id: true, fullName: true, businessName: true, profileImage: true } },
        category: { select: { id: true, categoryName: true, categorySlug: true } },
      },
    });

    if (!product) return jsonError("Product not found.", 404);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return jsonError("Failed to fetch product.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["ARTISAN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid product id.");

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return jsonError("Product not found.", 404);
    if (product.artisanId !== auth.session.accountId) return jsonError("Unauthorized to edit this product.", 403);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        productName: stringValue(body.productName, 150) || undefined,
        categoryId: Number(body.categoryId) || undefined,
        price: Number(body.price) || undefined,
        description: body.description !== undefined ? stringValue(body.description, 2000) || null : undefined,
        image: body.image !== undefined ? stringValue(body.image, 500) || null : undefined,
      },
      include: {
        category: { select: { id: true, categoryName: true } },
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Product Update Error:", error);
    return jsonError("Failed to update product.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["ARTISAN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid product id.");

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return jsonError("Product not found.", 404);
    if (auth.session.role === "ARTISAN" && product.artisanId !== auth.session.accountId) {
      return jsonError("Unauthorized to delete this product.", 403);
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Product Delete Error:", error);
    return jsonError("Failed to delete product.", 500);
  }
}
