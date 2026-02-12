import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface SearchEntry {
  id: string;
  query: string;
  resultCount: number | null;
  createdAt: string;
}

export function RecentSearches({ searches }: { searches: SearchEntry[] }) {
  if (searches.length === 0) {
    return (
      <Card>
        <CardTitle>Recent Searches</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          No searches yet. Start by{" "}
          <Link href="/search" className="text-blue-600 hover:underline">
            searching for grants
          </Link>
          .
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Recent Searches</CardTitle>
      <div className="mt-3 divide-y divide-gray-100">
        {searches.map((entry) => (
          <Link
            key={entry.id}
            href={`/search?q=${encodeURIComponent(entry.query)}`}
            className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {entry.query || "All grants"}
              </p>
              <p className="text-xs text-gray-500">
                {entry.resultCount !== null
                  ? `${entry.resultCount} results`
                  : ""}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(entry.createdAt)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
