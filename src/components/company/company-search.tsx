"use client";

import { useState } from "react";
import { useCompanySearch } from "@/hooks/use-company-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CompanySearchProps {
  onSelect: (companyNumber: string) => void;
}

export function CompanySearch({ onSelect }: CompanySearchProps) {
  const { query, setQuery, results, isLoading, error } = useCompanySearch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Input
        label="Search Companies House"
        placeholder="Enter company name or number..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isLoading && (
        <div className="absolute right-3 top-9">
          <Spinner size="sm" />
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-80 overflow-y-auto">
          {results.map((company) => (
            <button
              key={company.company_number}
              onClick={() => {
                onSelect(company.company_number);
                setIsOpen(false);
                setQuery(company.title);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {company.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {company.company_number} &middot;{" "}
                    {company.address_snippet ||
                      company.address?.locality ||
                      ""}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    company.company_status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {company.company_status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
