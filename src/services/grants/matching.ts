import type { GrantSearchParams } from "./types";
import { prisma } from "@/lib/prisma";
import { SIC_SECTION_TO_KEYWORDS } from "@/lib/constants";

interface CompanyContext {
  sicCodes: { code: string; section: string | null; division: string | null }[];
  companyType: string | null;
  dateOfCreation: Date | null;
}

export async function buildCompanyMatchParams(
  userId: string,
  baseParams: GrantSearchParams
): Promise<GrantSearchParams> {
  const company = await prisma.userCompany.findUnique({
    where: { userId },
    include: { sicCodes: true },
  });

  if (!company || company.sicCodes.length === 0) {
    return baseParams;
  }

  const sectors = [
    ...new Set(
      company.sicCodes
        .map((s) => s.section)
        .filter((s): s is string => s !== null)
    ),
  ];

  const sicCodes = company.sicCodes.map((s) => s.code);

  // Build keywords from SIC code descriptions
  const sicDescriptions = await prisma.sicCodeReference.findMany({
    where: { code: { in: sicCodes } },
    select: { description: true, divisionName: true },
  });

  const keywords = sicDescriptions
    .flatMap((s) => [s.description, s.divisionName])
    .filter(Boolean)
    .map((s) => s.toLowerCase())
    .slice(0, 5);

  const enhancedQuery = [baseParams.query, ...keywords]
    .filter(Boolean)
    .join(" ");

  return {
    ...baseParams,
    query: enhancedQuery || baseParams.query,
    sicCodes,
    sectors,
  };
}

export function scoreGrantRelevance(
  grant: { categories: string[]; description: string; title: string },
  context: CompanyContext
): number {
  let score = 0;

  const textToCheck =
    `${grant.title} ${grant.description} ${grant.categories.join(" ")}`.toLowerCase();

  for (const sic of context.sicCodes) {
    if (sic.section) {
      const sectionKeywords = SIC_SECTION_TO_KEYWORDS[sic.section] ?? [];
      for (const kw of sectionKeywords) {
        if (textToCheck.includes(kw.toLowerCase())) {
          score += 15;
          break;
        }
      }
    }
  }

  if (context.companyType === "ltd" && textToCheck.includes("sme")) {
    score += 10;
  }

  if (
    context.dateOfCreation &&
    new Date().getFullYear() - context.dateOfCreation.getFullYear() <= 2
  ) {
    if (
      textToCheck.includes("startup") ||
      textToCheck.includes("new business")
    ) {
      score += 20;
    }
  }

  return Math.min(score, 100);
}
