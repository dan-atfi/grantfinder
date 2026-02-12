import type {
  GrantProvider,
  GrantSearchParams,
  GrantSearchResult,
  GrantDetail,
  NormalizedGrant,
} from "../types";

const DATAGOV_BASE_URL = "https://data.gov.uk/api/action";

interface CkanSearchResponse {
  success: boolean;
  result: {
    count: number;
    results: CkanPackage[];
  };
}

interface CkanPackage {
  id: string;
  name: string;
  title: string;
  notes: string;
  organization?: { title: string; name: string };
  metadata_created: string;
  metadata_modified: string;
  resources?: { id: string; url: string; format: string; name: string; description?: string }[];
  tags?: { name: string }[];
  extras?: { key: string; value: string }[];
}

const SECTION_SEARCH_TERMS: Record<string, string> = {
  A: "agriculture",
  B: "mining",
  C: "manufacturing",
  D: "energy",
  E: "environment water",
  F: "construction",
  G: "retail wholesale",
  H: "transport",
  I: "hospitality",
  J: "technology digital",
  K: "finance",
  L: "real estate",
  M: "scientific research",
  N: "administration",
  O: "public administration",
  P: "education",
  Q: "health",
  R: "arts entertainment",
  S: "community services",
};

export class DataGovProvider implements GrantProvider {
  readonly source = "datagov" as const;
  readonly displayName = "Data.gov.uk Government Grants";
  readonly enabled = true;

  async search(params: GrantSearchParams): Promise<GrantSearchResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const start = (page - 1) * pageSize;

    const queryParts = ["grant"];
    if (params.query) queryParts.push(params.query);
    if (params.sectors?.length) {
      queryParts.push(
        ...params.sectors
          .map((s) => SECTION_SEARCH_TERMS[s] ?? "")
          .filter(Boolean)
      );
    }

    const q = queryParts.join(" ");
    const url = `${DATAGOV_BASE_URL}/package_search?q=${encodeURIComponent(q)}&rows=${pageSize}&start=${start}`;

    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) throw new Error(`data.gov.uk API error: ${response.status}`);

    const data: CkanSearchResponse = await response.json();
    if (!data.success) throw new Error("data.gov.uk API returned success=false");

    const grants = data.result.results.map((pkg) => this.normalize(pkg));

    return {
      grants,
      totalResults: data.result.count,
      page,
      pageSize,
      totalPages: Math.ceil(data.result.count / pageSize),
      source: this.source,
    };
  }

  async getById(externalId: string): Promise<GrantDetail | null> {
    const url = `${DATAGOV_BASE_URL}/package_show?id=${encodeURIComponent(externalId)}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success) return null;
    const pkg = data.result as CkanPackage;
    return {
      ...this.normalize(pkg),
      applicationUrl: pkg.resources?.[0]?.url,
      rawData: pkg,
    };
  }

  private normalize(pkg: CkanPackage): NormalizedGrant {
    return {
      id: `datagov:${pkg.id}`,
      source: "datagov",
      externalId: pkg.id,
      title: pkg.title,
      description: pkg.notes ?? "",
      fundingBody: pkg.organization?.title ?? "UK Government",
      currency: "GBP",
      status: "unknown",
      openDate: pkg.metadata_created,
      categories: pkg.tags?.map((t) => t.name) ?? [],
      applicationUrl: pkg.resources?.[0]?.url,
    };
  }
}
