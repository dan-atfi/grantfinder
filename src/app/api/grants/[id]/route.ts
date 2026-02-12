import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGrantById } from "@/services/grants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const source = request.nextUrl.searchParams.get("source");

  const compositeId = source ? `${source}:${id}` : id;

  try {
    const grant = await getGrantById(compositeId);
    if (!grant) {
      return NextResponse.json({ error: "Grant not found" }, { status: 404 });
    }
    return NextResponse.json(grant);
  } catch (error) {
    console.error("Grant detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grant details" },
      { status: 500 }
    );
  }
}
