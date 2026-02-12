import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCompanyProfile } from "@/services/companies-house";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { companyNumber } = await request.json();
    if (!companyNumber || typeof companyNumber !== "string") {
      return NextResponse.json(
        { error: "companyNumber is required" },
        { status: 400 }
      );
    }

    const profile = await getCompanyProfile(companyNumber);

    // Look up SIC code details from reference table
    const sicRefs = await prisma.sicCodeReference.findMany({
      where: { code: { in: profile.sic_codes ?? [] } },
    });
    const sicRefMap = new Map(sicRefs.map((s) => [s.code, s]));

    // Delete existing SIC codes if company already linked
    const existingCompany = await prisma.userCompany.findUnique({
      where: { userId: session.user.id },
    });

    if (existingCompany) {
      await prisma.companySicCode.deleteMany({
        where: { userCompanyId: existingCompany.id },
      });
    }

    // Upsert the company record
    const company = await prisma.userCompany.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyNumber: profile.company_number,
        companyName: profile.company_name,
        companyStatus: profile.company_status,
        companyType: profile.company_type,
        dateOfCreation: profile.date_of_creation
          ? new Date(profile.date_of_creation)
          : null,
        addressLine1: profile.registered_office_address?.address_line_1,
        addressLine2: profile.registered_office_address?.address_line_2,
        locality: profile.registered_office_address?.locality,
        region: profile.registered_office_address?.region,
        postalCode: profile.registered_office_address?.postal_code,
        country: profile.registered_office_address?.country,
        rawCompaniesHouseData: JSON.parse(JSON.stringify(profile)),
        sicCodes: {
          create: (profile.sic_codes ?? []).map((code) => ({
            code,
            description: sicRefMap.get(code)?.description ?? null,
            section: sicRefMap.get(code)?.section ?? null,
            division: sicRefMap.get(code)?.division ?? null,
          })),
        },
      },
      update: {
        companyNumber: profile.company_number,
        companyName: profile.company_name,
        companyStatus: profile.company_status,
        companyType: profile.company_type,
        dateOfCreation: profile.date_of_creation
          ? new Date(profile.date_of_creation)
          : null,
        addressLine1: profile.registered_office_address?.address_line_1,
        addressLine2: profile.registered_office_address?.address_line_2,
        locality: profile.registered_office_address?.locality,
        region: profile.registered_office_address?.region,
        postalCode: profile.registered_office_address?.postal_code,
        country: profile.registered_office_address?.country,
        rawCompaniesHouseData: JSON.parse(JSON.stringify(profile)),
        sicCodes: {
          create: (profile.sic_codes ?? []).map((code) => ({
            code,
            description: sicRefMap.get(code)?.description ?? null,
            section: sicRefMap.get(code)?.section ?? null,
            division: sicRefMap.get(code)?.division ?? null,
          })),
        },
      },
      include: { sicCodes: true },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Company link error:", error);
    return NextResponse.json(
      { error: "Failed to link company" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.userCompany.delete({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "No company linked" },
      { status: 404 }
    );
  }
}
