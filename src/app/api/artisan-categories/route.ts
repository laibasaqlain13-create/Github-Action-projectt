import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireSession } from "@/lib/api";

export async function GET() {
  const auth = requireSession(["ARTISAN"]);
  if ("error" in auth) return auth.error;

  const artisanId = auth.session.accountId;

  const categories = await prisma.artisanCategory.findMany({
    where: { artisanId },
    include: { category: true },
  });

  return NextResponse.json({ categories: categories.map((ac) => ac.category) });
}

export async function POST(request: NextRequest) {
  const auth = requireSession(["ARTISAN"]);
  if ("error" in auth) return auth.error;

  const artisanId = auth.session.accountId;

  try {
    const body = await request.json();
    const categoryIds: number[] = body.categoryIds;

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: "categoryIds must be an array." },
        { status: 400 }
      );
    }

    // Get the artisan's current categories
    const existing = await prisma.artisanCategory.findMany({
      where: { artisanId },
      select: { id: true, categoryId: true },
    });

    const existingIds = existing.map((e) => e.categoryId);

    // Categories to add (in new list but not in existing)
    const toAdd = categoryIds.filter((id) => !existingIds.includes(id));

    // Categories to remove (in existing but not in new list)
    const toRemove = existing.filter((e) => !categoryIds.includes(e.categoryId));

    // Perform removals and additions in a transaction
    await prisma.$transaction(async (tx) => {
      // Remove unchecked categories
      for (const item of toRemove) {
        await tx.artisanCategory.delete({
          where: { id: item.id },
        });
      }

      // Add new categories
      for (const categoryId of toAdd) {
        await tx.artisanCategory.create({
          data: { artisanId, categoryId },
        });
      }
    });

    // Fetch updated categories
    const updated = await prisma.artisanCategory.findMany({
      where: { artisanId },
      include: { category: true },
    });

    return NextResponse.json({
      message: "Categories updated successfully.",
      categories: updated.map((ac) => ac.category),
    });
  } catch (error) {
    console.error("Artisan Categories Update Error:", error);
    return jsonError("Failed to update categories.", 500);
  }
}

