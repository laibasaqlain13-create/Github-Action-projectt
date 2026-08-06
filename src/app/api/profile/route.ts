import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { readSessionToken, sessionCookieName } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const session = readSessionToken(token);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    if (session.role === "CUSTOMER") {
      const user = await prisma.user.findUnique({
        where: {
          id: session.accountId,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json(user);
    }

    const artisan = await prisma.artisan.findUnique({
      where: {
        id: session.accountId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        businessName: true,
        bio: true,
        experience: true,
        address: true,
        profileImage: true,
        cnicNumber: true,
        verificationStatus: true,
      },
    });

    return NextResponse.json(artisan);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const session = readSessionToken(token);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (session.role === "CUSTOMER") {
      const updatedUser = await prisma.user.update({
        where: {
          id: session.accountId,
        },
        data: {
          fullName: body.fullName,
          phone: body.phone,
        },
      });

      return NextResponse.json({
        message: "Profile updated successfully.",
        user: updatedUser,
      });
    }

    const updatedArtisan = await prisma.artisan.update({
      where: {
        id: session.accountId,
      },
      data: {
        fullName: body.fullName,
        phone: body.phone,
        businessName: body.businessName,
        bio: body.bio,
        experience: body.experience,
        address: body.address,
        profileImage: body.profileImage ?? undefined,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      artisan: updatedArtisan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
