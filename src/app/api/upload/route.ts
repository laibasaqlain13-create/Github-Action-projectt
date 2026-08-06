import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, uniqueName);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, bytes);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}

