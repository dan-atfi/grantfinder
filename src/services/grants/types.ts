export interface GrantSearchParams {
  query?: string;
  sicCodes?: string[];
  sectors?: string[];
  minAmount?: number;
  maxAmount?: number;
  status?: "open" | "closed" | "upcoming" | "all";
  matchCompany?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GrantSearchResult {
  grants: NormalizedGrant[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
  source: string;
}

export interface NormalizedGrant {
  id: string;
  source: GrantSource;
  externalId: string;
  title: string;
  description: string;
  fundingBody: string;
  amountMin?: number;
  amountMax?: number;
  currency: string;
  status: "open" | "closed" | "upcoming" | "unknown";
  openDate?: string;
  closeDate?: string;
  applicationUrl?: string;
  categories: string[];
  sicCodesRelevant?: string[];
  metadata?: Record<string, unknown>;
}

export interface GrantDetail extends NormalizedGrant {
  eligibilityCriteria?: string;
  applicationProcess?: string;
  contactEmail?: string;
  contactPhone?: string;
  region?: string;
  relatedGrants?: { id: string; title: string }[];
  rawData?: unknown;
}

export type GrantSource = "gtr" | "datagov" | "findagrant";

export interface GrantProvider {
  readonly source: GrantSource;
  readonly displayName: string;
  readonly enabled: boolean;
  search(params: GrantSearchParams): Promise<GrantSearchResult>;
  getById(externalId: string): Promise<GrantDetail | null>;
}
