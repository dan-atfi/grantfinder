export interface CHSearchResponse {
  items: CHCompanySearchItem[];
  items_per_page: number;
  kind: string;
  page_number: number;
  start_index: number;
  total_results: number;
}

export interface CHCompanySearchItem {
  company_number: string;
  company_status: string;
  company_type: string;
  date_of_creation: string;
  date_of_cessation?: string;
  description: string;
  description_identifier: string[];
  kind: string;
  links: { self: string };
  title: string;
  address: CHAddress;
  address_snippet?: string;
  sic_codes?: string[];
}

export interface CHCompanyProfile {
  company_name: string;
  company_number: string;
  company_status: string;
  company_type: string;
  date_of_creation: string;
  date_of_cessation?: string;
  sic_codes: string[];
  registered_office_address: CHAddress;
  accounts?: {
    last_accounts?: { type: string; made_up_to: string };
    next_due: string;
    next_made_up_to: string;
  };
  confirmation_statement?: {
    last_made_up_to: string;
    next_due: string;
    next_made_up_to: string;
  };
  has_charges: boolean;
  jurisdiction: string;
  type: string;
}

export interface CHAddress {
  address_line_1?: string;
  address_line_2?: string;
  country?: string;
  locality?: string;
  postal_code?: string;
  region?: string;
}
