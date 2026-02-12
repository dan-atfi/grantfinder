"use client";

import { GrantCard } from "./grant-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
  categories: string[];
  applicationUrl?: string;
}

interface GrantListProps {
  grants: Grant[];
  isLoading: boolean;
  totalResults?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isSaved: (source: string, externalId: string) => boolean;
  onSave: (grant: Grant) => void;
  onUnsave: (source: string, externalId: string) => void;
}

export function GrantList({
  grants,
  isLoading,
  totalResults = 0,
  currentPage = 1,
  onPageChange,
  isSaved,
  onSave,
  onUnsave,
}: GrantListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (grants.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No grants found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search terms or filters.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalResults / 20);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {totalResults} grant{totalResults !== 1 ? "s" : ""} found
      </p>

      {grants.map((grant) => (
        <GrantCard
          key={grant.id}
          grant={grant}
          isSaved={isSaved(grant.source, grant.externalId)}
          onSave={() => onSave(grant)}
          onUnsave={() => onUnsave(grant.source, grant.externalId)}
        />
      ))}

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
