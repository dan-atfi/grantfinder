import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrantSourceBadge } from "@/components/grants/grant-source-badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface Grant {
  id: string;
  source: string;
  title: string;
  fundingBody: string;
  amountMin?: number;
  currency: string;
  status: string;
  categories: string[];
}

export function RecommendedGrants({ grants }: { grants: Grant[] }) {
  if (grants.length === 0) {
    return (
      <Card>
        <CardTitle>Recommended Grants</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          Link your company and search for grants to get personalised
          recommendations.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Recommended for You</CardTitle>
      <div className="mt-3 space-y-3">
        {grants.map((grant) => (
          <Link
            key={grant.id}
            href={`/grants/${encodeURIComponent(grant.id)}`}
            className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <GrantSourceBadge source={grant.source} />
              <Badge
                variant={grant.status === "open" ? "green" : "default"}
              >
                {grant.status}
              </Badge>
            </div>
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
              {grant.title}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>{grant.fundingBody}</span>
              {grant.amountMin && (
                <span>{formatCurrency(grant.amountMin, grant.currency)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/search"
        className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-500"
      >
        Search all grants
      </Link>
    </Card>
  );
}
