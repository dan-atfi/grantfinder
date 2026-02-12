import type {
  GrantProvider,
  GrantSearchParams,
  GrantSearchResult,
  GrantDetail,
  NormalizedGrant,
} from "../types";
import { SIC_SECTION_TO_KEYWORDS } from "@/lib/constants";

const GTR_BASE_URL = "https://gtr.ukri.org/gtr/api";

interface GtrProjectsResponse {
  project?: GtrProject[];
  page: number;
  size: number;
  totalPages: number;
  totalSize: number;
}

interface GtrProject {
  id: string;
  title: string;
  status: string;
  abstractText?: string;
  techAbstractText?: string;
  fund?: {
    valuePounds?: { amount: number; currencyCode: string };
    start?: string;
    end?: string;
    type?: string;
    funder?: { name: string };
  };
  grantCategory?: string;
  leadOrganisationDepartment?: string;
  identifiers?: { identifier: { value: string; type: string }[] };
}

export class GtrProvider implements GrantProvider {
  readonly source = "gtr" as const;
  readonly displayName = "UKRI Gateway to Research";
  readonly enabled = true;

  async search(params: GrantSearchParams): Promise<GrantSearchResult> {
    const page = params.page ?? 1;
    const size = Math.min(params.pageSize ?? 20, 100);

    const queryParts: string[] = [];
    if (params.query) queryParts.push(params.query);

    if (params.sectors?.length) {
      const sectorTerms = params.sectors
        .map((s) => SIC_SECTION_TO_KEYWORDS[s])
        .filter(Boolean)
        .flat();
      if (sectorTerms.length) queryParts.push(sectorTerms.slice(0, 5).join(" "));
    }

    const q = queryParts.join(" ") || "grant funding";
    const url = `${GTR_BASE_URL}/projects?q=${encodeURIComponent(q)}&p=${page}&s=${size}`;

    const response = await fetch(url, {
      headers: { Accept: "application/vnd.rcuk.gtr.json-v7" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`GtR API error: ${response.status}`);
    }

    const data: GtrProjectsResponse = await response.json();
    const grants = (data.project ?? []).map((p) => this.normalize(p));

    return {
      grants,
      totalResults: data.totalSize ?? 0,
      page: data.page ?? page,
      pageSize: data.size ?? size,
      totalPages: data.totalPages ?? 0,
      source: this.source,
    };
  }

  async getById(externalId: string): Promise<GrantDetail | null> {
    const url = `${GTR_BASE_URL}/projects/${externalId}`;
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.rcuk.gtr.json-v7" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data: GtrProject = await response.json();
    return {
      ...this.normalize(data),
      eligibilityCriteria: data.techAbstractText,
      rawData: data,
    };
  }

  private normalize(project: GtrProject): NormalizedGrant {
    const now = new Date();
    const endDate = project.fund?.end ? new Date(project.fund.end) : undefined;
    const startDate = project.fund?.start
      ? new Date(project.fund.start)
      : undefined;

    let status: NormalizedGrant["status"] = "unknown";
    if (startDate && startDate > now) {
      status = "upcoming";
    } else if (endDate) {
      status = endDate > now ? "open" : "closed";
    }

    return {
      id: `gtr:${project.id}`,
      source: "gtr",
      externalId: project.id,
      title: project.title,
      description: project.abstractText ?? "",
      fundingBody: project.fund?.funder?.name ?? "UKRI",
      amountMin: project.fund?.valuePounds?.amount,
      amountMax: project.fund?.valuePounds?.amount,
      currency: project.fund?.valuePounds?.currencyCode ?? "GBP",
      status,
      openDate: startDate?.toISOString(),
      closeDate: endDate?.toISOString(),
      categories: project.grantCategory ? [project.grantCategory] : [],
      metadata: {
        department: project.leadOrganisationDepartment,
        projectReference: project.identifiers?.identifier?.find(
          (i) => i.type === "RCUK"
        )?.value,
      },
    };
  }
}
