"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GrantSourceBadge } from "@/components/grants/grant-source-badge";
import { SaveGrantButton } from "@/components/grants/save-grant-button";
import { useSavedGrants } from "@/hooks/use-saved-grants";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

interface GrantDetail {
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
  eligibilityCriteria?: string;
  applicationProcess?: string;
  contactEmail?: string;
  region?: string;
}

const statusConfig = {
  open: { label: "Open", variant: "green" as const },
  closed: { label: "Closed", variant: "red" as const },
  upcoming: { label: "Upcoming", variant: "yellow" as const },
  unknown: { label: "Unknown", variant: "default" as const },
};

export default function GrantDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [grant, setGrant] = useState<GrantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSaved, saveGrant, unsaveGrant } = useSavedGrants();

  useEffect(() => {
    fetch(`/api/grants/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch grant");
        return res.json();
      })
      .then((data) => setGrant(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Grant not found</h2>
        <p className="text-gray-500 mt-1">{error || "This grant could not be loaded."}</p>
        <Link href="/search">
          <Button variant="outline" className="mt-4">
            Back to search
          </Button>
        </Link>
      </div>
    );
  }

  const saved = isSaved(grant.source, grant.externalId);
  const statusInfo = statusConfig[grant.status];

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/search"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to search
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <GrantSourceBadge source={grant.source} />
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <SaveGrantButton
            isSaved={saved}
            onSave={() =>
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
            onUnsave={() => unsaveGrant(grant.source, grant.externalId)}
          />
        </div>

        <CardTitle className="text-xl mb-4">{grant.title}</CardTitle>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Funding Body</dt>
            <dd className="mt-1 text-gray-900">{grant.fundingBody}</dd>
          </div>
          {grant.amountMin && (
            <div>
              <dt className="font-medium text-gray-500">Funding Amount</dt>
              <dd className="mt-1 text-gray-900">
                {formatCurrency(grant.amountMin, grant.currency)}
                {grant.amountMax &&
                  grant.amountMax !== grant.amountMin &&
                  ` - ${formatCurrency(grant.amountMax, grant.currency)}`}
              </dd>
            </div>
          )}
          {grant.openDate && (
            <div>
              <dt className="font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-gray-900">
                {formatDate(grant.openDate)}
              </dd>
            </div>
          )}
          {grant.closeDate && (
            <div>
              <dt className="font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-gray-900">
                {formatDate(grant.closeDate)}
              </dd>
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {grant.description}
          </p>
        </div>

        {grant.eligibilityCriteria && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Eligibility / Technical Details
            </h3>
            <p className="text-gray-700 whitespace-pre-line text-sm">
              {grant.eligibilityCriteria}
            </p>
          </div>
        )}

        {grant.categories.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {grant.categories.map((cat) => (
                <Badge key={cat}>{cat}</Badge>
              ))}
            </div>
          </div>
        )}

        {grant.applicationUrl && (
          <div className="mt-6">
            <a
              href={grant.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                View application
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
