import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { VerificationStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = Number(searchParams.get("categoryId"));
  const statuses: VerificationStatus[] = ["APPROVED", "PENDING"];
  const where = { verificationStatus: { in: statuses }, ...(Number.isInteger(categoryId) && categoryId > 0 ? { artisanCategories: { some: { categoryId } } } : {}) };
  const artisans = await prisma.artisan.findMany({ where, select: { id: true, fullName: true, businessName: true, bio: true, experience: true, address: true, profileImage: true, verificationStatus: true, artisanCategories: { include: { category: true } } }, orderBy: { id: "desc" } });
  return NextResponse.json({ artisans });
}
