import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      role,
      fullName,
      email,
      password,
      phone,

      // Artisan fields
      businessName,
      about,
      city,
      cnic,
      craftCategory,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const existingArtisan = await prisma.artisan.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser || existingArtisan) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================
    // CUSTOMER
    // ==========================

    if (role === "customer") {
      const user = await prisma.user.create({
        data: {
          fullName,
          email: normalizedEmail,
          password: hashedPassword,
          phone,
        },
      });

      return NextResponse.json(user, { status: 201 });
    }

    // ==========================
    // ARTISAN
    // ==========================

    if (role === "artisan") {
      const artisan = await prisma.artisan.create({
        data: {
          fullName,
          email: normalizedEmail,
          password: hashedPassword,
          phone,
          businessName: businessName || "",
          bio: about || "",
          address: city || "",
          cnicNumber: cnic || "",
        },
      });

      // Save craft category to ArtisanCategory join table
      if (craftCategory) {
        // Find or create the category
        let category = await prisma.category.findFirst({
          where: { categoryName: craftCategory },
        });

        if (!category) {
          const slug = craftCategory
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          category = await prisma.category.create({
            data: {
              categoryName: craftCategory,
              categorySlug: slug,
              status: "ACTIVE",
            },
          });
        }

        await prisma.artisanCategory.create({
          data: {
            artisanId: artisan.id,
            categoryId: category.id,
          },
        });
      }

      return NextResponse.json(artisan, { status: 201 });
    }

    return NextResponse.json(
      { error: "Invalid role." },
      { status: 400 }
    );
  } catch (error) {
  console.error("Registration Error:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Registration failed.",
    },
    { status: 500 }
  );
  }}