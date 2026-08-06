import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId } from "@/lib/api";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id); if (!id) return jsonError("Invalid artisan id.");
  const artisan = await prisma.artisan.findUnique({ where: { id }, select: { id: true, fullName: true, businessName: true, bio: true, experience: true, address: true, profileImage: true, verificationStatus: true, artisanCategories: { include: { category: true } }, products: { include: { category: true } }, reviews: { include: { customer: { select: { fullName: true } } } } } });
  return artisan ? NextResponse.json({ artisan }) : jsonError("Artisan not found.", 404);
}
