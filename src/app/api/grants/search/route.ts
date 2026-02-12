import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchGrants } from "@/services/grants";
import { buildCompanyMatchParams } from "@/services/grants/matching";
import { grantSearchSchema } from "@/lib/validations/grants";
import { prisma } from "@/lib/prisma";
import { canPerformSearch } from "@/lib/subscription";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription limits
  const searchCheck = await canPerformSearch(session.user.id);
  if (!searchCheck.allowed) {
    return NextResponse.json(
      {
        error: "Search limit reached",
        message: `You've used all ${searchCheck.limit} searches for this month. Upgrade your plan to continue searching.`,
        limit: searchCheck.limit,
        remaining: 0,
        plan: searchCheck.plan,
      },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const parsed = grantSearchSchema.safeParse({
    query: searchParams.get("q") || undefined,
    sicCodes: searchParams.getAll("sic"),
    sector: searchParams.get("sector") || undefined,
    minAmount: searchParams.get("minAmount") || undefined,
    maxAmount: searchParams.get("maxAmount") || undefined,
    status: searchParams.get("status") || undefined,
    matchCompany: searchParams.get("matchCompany") || undefined,
    page: searchParams.get("page") || undefined,
    pageSize: searchParams.get("pageSize") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    let params: Parameters<typeof searchGrants>[0] = {
      ...parsed.data,
      sectors: parsed.data.sector ? [parsed.data.sector] : undefined,
    };

    // Enhance search with company data if requested
    if (parsed.data.matchCompany) {
      params = await buildCompanyMatchParams(session.user.id, params);
    }

    const results = await searchGrants(params);

    // Record search history
    await prisma.searchHistory.create({
      data: {
        userId: session.user.id,
        query: parsed.data.query || "",
        filters: {
          sector: parsed.data.sector,
          matchCompany: parsed.data.matchCompany,
          status: parsed.data.status,
        },
        resultCount: results.totalResults,
      },
    }).catch(console.error); // Don't fail the search if history recording fails

    return NextResponse.json(results);
  } catch (error) {
    console.error("Grant search failed:", error);
    return NextResponse.json(
      { error: "Failed to search grants" },
      { status: 500 }
    );
  }
}
