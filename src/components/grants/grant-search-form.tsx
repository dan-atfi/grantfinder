"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SIC_SECTION_NAMES } from "@/lib/constants";

interface SearchFormProps {
  onSearch: (params: {
    query?: string;
    sector?: string;
    status?: string;
    matchCompany?: boolean;
    page?: number;
  }) => void;
  isLoading: boolean;
  hasCompany?: boolean;
}

export function GrantSearchForm({
  onSearch,
  isLoading,
  hasCompany = false,
}: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [matchCompany, setMatchCompany] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: query || undefined,
      sector: sector || undefined,
      status: status || undefined,
      matchCompany,
      page: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search grants... (e.g. 'innovation', 'digital', 'green energy')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={isLoading}>
          Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All sectors</option>
          {Object.entries(SIC_SECTION_NAMES).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="upcoming">Upcoming</option>
          <option value="closed">Closed</option>
        </select>

        {hasCompany && (
          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={matchCompany}
              onChange={(e) => setMatchCompany(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Match my company
            </span>
          </label>
        )}
      </div>
    </form>
  );
}
