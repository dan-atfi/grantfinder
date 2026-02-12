import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedGrants = await prisma.savedGrant.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedGrants);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      grantSource,
      externalId,
      title,
      description,
      fundingBody,
      amountMin,
      amountMax,
      currency,
      openDate,
      closeDate,
      applicationUrl,
      categories,
      rawData,
    } = body;

    if (!grantSource || !externalId || !title) {
      return NextResponse.json(
        { error: "grantSource, externalId, and title are required" },
        { status: 400 }
      );
    }

    const savedGrant = await prisma.savedGrant.upsert({
      where: {
        userId_grantSource_externalId: {
          userId: session.user.id,
          grantSource,
          externalId,
        },
      },
      create: {
        userId: session.user.id,
        grantSource,
        externalId,
        title,
        description,
        fundingBody,
        amountMin,
        amountMax,
        currency,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
        applicationUrl,
        categories: categories || [],
        rawData,
      },
      update: {
        title,
        description,
        fundingBody,
        amountMin,
        amountMax,
        currency,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
        applicationUrl,
        categories: categories || [],
        rawData,
      },
    });

    return NextResponse.json(savedGrant, { status: 201 });
  } catch (error) {
    console.error("Save grant error:", error);
    return NextResponse.json(
      { error: "Failed to save grant" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const grantSource = request.nextUrl.searchParams.get("source");
  const externalId = request.nextUrl.searchParams.get("externalId");

  try {
    if (id) {
      await prisma.savedGrant.delete({
        where: { id, userId: session.user.id },
      });
    } else if (grantSource && externalId) {
      await prisma.savedGrant.delete({
        where: {
          userId_grantSource_externalId: {
            userId: session.user.id,
            grantSource,
            externalId,
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: "id or source+externalId required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Grant not found or already removed" },
      { status: 404 }
    );
  }
}
