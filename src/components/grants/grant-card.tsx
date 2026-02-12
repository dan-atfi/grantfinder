import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrantSourceBadge } from "./grant-source-badge";
import { SaveGrantButton } from "./save-grant-button";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";

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

interface GrantCardProps {
  grant: Grant;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

const statusConfig = {
  open: { label: "Open", variant: "green" as const },
  closed: { label: "Closed", variant: "red" as const },
  upcoming: { label: "Upcoming", variant: "yellow" as const },
  unknown: { label: "Unknown", variant: "default" as const },
};

export function GrantCard({ grant, isSaved, onSave, onUnsave }: GrantCardProps) {
  const statusInfo = statusConfig[grant.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <GrantSourceBadge source={grant.source} />
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          <Link
            href={`/grants/${encodeURIComponent(grant.id)}`}
            className="block"
          >
            <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {grant.title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {truncate(grant.description, 200)}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span>{grant.fundingBody}</span>
            {grant.amountMin && (
              <span>
                {formatCurrency(grant.amountMin, grant.currency)}
                {grant.amountMax &&
                  grant.amountMax !== grant.amountMin &&
                  ` - ${formatCurrency(grant.amountMax, grant.currency)}`}
              </span>
            )}
            {grant.closeDate && (
              <span>Closes: {formatDate(grant.closeDate)}</span>
            )}
          </div>

          {grant.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {grant.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="default">
                  {cat}
                </Badge>
              ))}
              {grant.categories.length > 3 && (
                <Badge variant="default">
                  +{grant.categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <SaveGrantButton
            isSaved={isSaved}
            onSave={onSave}
            onUnsave={onUnsave}
          />
        </div>
      </div>
    </Card>
  );
}
