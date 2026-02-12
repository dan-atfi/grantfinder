"use client";

import { useEffect, useState } from "react";
import { GrantSearchForm } from "@/components/grants/grant-search-form";
import { GrantList } from "@/components/grants/grant-list";
import { useGrantSearch } from "@/hooks/use-grant-search";
import { useSavedGrants } from "@/hooks/use-saved-grants";

export default function SearchPage() {
  const { results, totalResults, isLoading, error, search, currentPage } =
    useGrantSearch();
  const { isSaved, saveGrant, unsaveGrant } = useSavedGrants();
  const [hasCompany, setHasCompany] = useState(false);
  const [lastParams, setLastParams] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.company) setHasCompany(true);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (params: {
    query?: string;
    sector?: string;
    status?: string;
    matchCompany?: boolean;
    page?: number;
  }) => {
    setLastParams(params);
    search(params);
  };

  const handlePageChange = (page: number) => {
    search({ ...lastParams, page });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Grants</h1>
        <p className="text-gray-600 mt-1">
          Search across UK government grant databases to find funding
          opportunities for your business.
        </p>
      </div>

      <GrantSearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        hasCompany={hasCompany}
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <GrantList
        grants={results}
        isLoading={isLoading}
        totalResults={totalResults}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isSaved={isSaved}
        onSave={(grant) =>
          saveGrant({
            source: grant.source,
            externalId: grant.externalId,
            title: grant.title,
            description: grant.description,
            fundingBody: grant.fundingBody,
            amountMin: grant.amountMin,
            amountMax: grant.amountMax,
            currency: grant.currency,
            openDate: grant.openDate,
            closeDate: grant.closeDate,
            applicationUrl: grant.applicationUrl,
            categories: grant.categories,
          })
        }
        onUnsave={unsaveGrant}
      />
    </div>
  );
}
