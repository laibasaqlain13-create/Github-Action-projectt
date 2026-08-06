import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET() {
  const categories = await prisma.category.findMany({ where: { status: "ACTIVE" }, orderBy: { categoryName: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const auth = requireSession(["ADMIN"]); if ("error" in auth) return auth.error;
  const body = await readBody(request); if (!body) return jsonError("Invalid request body.");
  const categoryName = stringValue(body.categoryName, 100);
  const categorySlug = stringValue(body.categorySlug, 100).toLowerCase();
  if (!categoryName || !categorySlug) return jsonError("Category name and slug are required.");
  const category = await prisma.category.create({ data: { categoryName, categorySlug, categoryIcon: stringValue(body.categoryIcon, 200) || null, description: stringValue(body.description, 1000) || null, status: stringValue(body.status, 20) || "ACTIVE" } });
  return NextResponse.json({ category }, { status: 201 });
}
