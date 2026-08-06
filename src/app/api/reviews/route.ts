import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artisanId = searchParams.get("artisanId");
    const customerId = searchParams.get("customerId");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (artisanId) where.artisanId = Number(artisanId);
    if (customerId) where.customerId = Number(customerId);
    if (category) where.category = category;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews Fetch Error:", error);
    return jsonError("Failed to fetch reviews.", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["CUSTOMER"]);
  if ("error" in auth) return auth.error;

  const body = await readBody(request);
  if (!body) return jsonError("Invalid request body.");

  const artisanId = Number(body.artisanId);
  const rating = Number(body.rating);
  const category = stringValue(body.category, 100);
  const comment = stringValue(body.comment, 2000);

  if (!artisanId || !rating || rating < 1 || rating > 5) {
    return jsonError("Valid artisan ID and rating (1-5) are required.");
  }

  try {
    // Verify artisan exists
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) return jsonError("Artisan not found.", 404);

    // Check if customer already reviewed this artisan
    const existingReview = await prisma.review.findUnique({
      where: {
        customerId_artisanId: {
          customerId: auth.session.accountId,
          artisanId,
        },
      },
    });
    if (existingReview) {
      return jsonError("You have already reviewed this artisan.", 400);
    }

    const review = await prisma.review.create({
      data: {
        customerId: auth.session.accountId,
        artisanId,
        category: category || null,
        rating,
        comment: comment || null,
      },
      include: {
        customer: { select: { id: true, fullName: true } },
        artisan: { select: { id: true, fullName: true, businessName: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review Create Error:", error);
    return jsonError("Failed to create review.", 500);
  }
}
