import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCompanyProfile } from "@/services/companies-house";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyNumber: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyNumber } = await params;

  try {
    const profile = await getCompanyProfile(companyNumber);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Companies House profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company profile" },
      { status: 502 }
    );
  }
}
