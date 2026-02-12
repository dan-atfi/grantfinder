import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchCompanies } from "@/services/companies-house";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const results = await searchCompanies(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Companies House search error:", error);
    return NextResponse.json(
      { error: "Failed to search Companies House" },
      { status: 502 }
    );
  }
}
