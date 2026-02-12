"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

interface CompanySearchResult {
  company_number: string;
  title: string;
  company_status: string;
  company_type: string;
  date_of_creation: string;
  address_snippet?: string;
  address?: {
    address_line_1?: string;
    locality?: string;
    postal_code?: string;
  };
}

export function useCompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/api/company/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data) => setResults(data.items ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Failed to search companies");
          console.error(err);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  return { query, setQuery, results, isLoading, error };
}
