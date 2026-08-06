import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseId, readBody, requireSession, stringValue } from "@/lib/api";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id); if (!id) return jsonError("Invalid category id.");
  const category = await prisma.category.findUnique({ where: { id } });
  return category ? NextResponse.json({ category }) : jsonError("Category not found.", 404);
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = requireSession(["ADMIN"]); if ("error" in auth) return auth.error;
  const id = parseId(params.id); const body = await readBody(request); if (!id || !body) return jsonError("Invalid request.");
  try {
    const category = await prisma.category.update({ where: { id }, data: { categoryName: stringValue(body.categoryName, 100) || undefined, categorySlug: stringValue(body.categorySlug, 100).toLowerCase() || undefined, categoryIcon: typeof body.categoryIcon === "string" ? stringValue(body.categoryIcon, 200) || null : undefined, description: typeof body.description === "string" ? stringValue(body.description, 1000) || null : undefined, status: stringValue(body.status, 20) || undefined } });
    return NextResponse.json({ category });
  } catch { return jsonError("Category not found.", 404); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = requireSession(["ADMIN"]); if ("error" in auth) return auth.error;
  const id = parseId(params.id); if (!id) return jsonError("Invalid category id.");
  try { await prisma.category.delete({ where: { id } }); return NextResponse.json({ message: "Category deleted." }); } catch { return jsonError("Category cannot be deleted or does not exist.", 409); }
}
