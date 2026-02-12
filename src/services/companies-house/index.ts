import { getCompaniesHouseClient } from "./client";
import type { CHSearchResponse, CHCompanyProfile } from "./types";

export async function searchCompanies(
  query: string,
  itemsPerPage = 10,
  startIndex = 0
): Promise<CHSearchResponse> {
  const client = getCompaniesHouseClient();
  const params = new URLSearchParams({
    q: query,
    items_per_page: String(itemsPerPage),
    start_index: String(startIndex),
  });
  return client.get<CHSearchResponse>(`/search/companies?${params}`);
}

export async function getCompanyProfile(
  companyNumber: string
): Promise<CHCompanyProfile> {
  const client = getCompaniesHouseClient();
  return client.get<CHCompanyProfile>(`/company/${companyNumber}`);
}

export type { CHSearchResponse, CHCompanyProfile, CHCompanySearchItem } from "./types";
