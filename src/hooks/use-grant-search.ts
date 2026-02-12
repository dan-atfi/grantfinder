"use client";

import { useState, useCallback } from "react";

interface Grant {
  id: string;
  source: string;
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
  metadata?: Record<string, unknown>;
}

interface SearchResults {
  grants: Grant[];
  totalResults: number;
  page: number;
  pageSize: number;
  sourceBreakdown: Record<string, number>;
}

interface SearchParams {
  query?: string;
  sector?: string;
  status?: string;
  matchCompany?: boolean;
  page?: number;
}

export function useGrantSearch() {
  const [results, setResults] = useState<Grant[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [sourceBreakdown, setSourceBreakdown] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const search = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set("q", params.query);
    if (params.sector) searchParams.set("sector", params.sector);
    if (params.status) searchParams.set("status", params.status);
    if (params.matchCompany) searchParams.set("matchCompany", "true");
    if (params.page) searchParams.set("page", String(params.page));

    try {
      const res = await fetch(`/api/grants/search?${searchParams}`);
      if (!res.ok) throw new Error("Search failed");

      const data: SearchResults = await res.json();
      setResults(data.grants);
      setTotalResults(data.totalResults);
      setSourceBreakdown(data.sourceBreakdown);
      setCurrentPage(data.page);
    } catch (err) {
      setError("Failed to search grants. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    totalResults,
    sourceBreakdown,
    isLoading,
    error,
    search,
    currentPage,
  };
}
