"use client";

import { useSavedGrants } from "@/hooks/use-saved-grants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GrantSourceBadge } from "@/components/grants/grant-source-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function SavedGrantsPage() {
  const { savedGrants, isLoading, unsaveGrant } = useSavedGrants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Grants</h1>
        <p className="text-gray-600 mt-1">
          Your bookmarked grants for quick reference.
        </p>
      </div>

      {savedGrants.length === 0 ? (
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No saved grants
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for grants and save the ones that interest you.
          </p>
          <Link href="/search">
            <Button variant="outline" className="mt-4">
              Search grants
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {savedGrants.length} saved grant
            {savedGrants.length !== 1 ? "s" : ""}
          </p>

          {savedGrants.map((grant) => (
            <Card key={grant.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <GrantSourceBadge source={grant.grantSource} />
                  </div>

                  <Link
                    href={`/grants/${encodeURIComponent(`${grant.grantSource}:${grant.externalId}`)}`}
                  >
                    <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {grant.title}
                    </h3>
                  </Link>

                  {grant.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {grant.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {grant.fundingBody && <span>{grant.fundingBody}</span>}
                    {grant.amountMin && (
                      <span>
                        {formatCurrency(
                          Number(grant.amountMin),
                          grant.currency ?? "GBP"
                        )}
                      </span>
                    )}
                    <span>Saved {formatDate(grant.createdAt)}</span>
                  </div>

                  {grant.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {grant.categories.slice(0, 3).map((cat) => (
                        <Badge key={cat}>{cat}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    unsaveGrant(grant.grantSource, grant.externalId)
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from saved"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
