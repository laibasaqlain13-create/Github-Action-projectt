import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    if (!id) return jsonError("Invalid review id.");

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    if (!review) return jsonError("Review not found.", 404);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Review Fetch Error:", error);
    return jsonError("Failed to fetch review.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid review id.");

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return jsonError("Review not found.", 404);
    if (review.customerId !== auth.session.accountId) {
      return jsonError("You can only edit your own reviews.", 403);
    }

    const rating = Number(body.rating);
    const category = body.category !== undefined ? stringValue(body.category, 100) || null : undefined;
    const comment = body.comment !== undefined ? stringValue(body.comment, 2000) || null : undefined;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(rating >= 1 && rating <= 5 ? { rating } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(comment !== undefined ? { comment } : {}),
      },
      include: {
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    return NextResponse.json({ review: updated });
  } catch (error) {
    console.error("Review Update Error:", error);
    return jsonError("Failed to update review.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireSession(["CUSTOMER", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const id = parseId(params.id);
  if (!id) return jsonError("Invalid review id.");

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return jsonError("Review not found.", 404);

    if (auth.session.role === "CUSTOMER" && review.customerId !== auth.session.accountId) {
      return jsonError("You can only delete your own reviews.", 403);
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Review Delete Error:", error);
    return jsonError("Failed to delete review.", 500);
  }
}
