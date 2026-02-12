"use client";

import { useEffect, useState } from "react";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentSearches } from "@/components/dashboard/recent-searches";
import { RecommendedGrants } from "@/components/dashboard/recommended-grants";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface DashboardData {
  savedCount: number;
  searchCount: number;
  hasCompany: boolean;
  recentSearches: {
    id: string;
    query: string;
    resultCount: number | null;
    createdAt: string;
  }[];
  recommendedGrants: {
    id: string;
    source: string;
    title: string;
    fundingBody: string;
    amountMin?: number;
    currency: string;
    status: string;
    categories: string[];
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileRes, savedRes, searchRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/grants/saved"),
          fetch("/api/grants/search?q=business+innovation&pageSize=5"),
        ]);

        const profile = await profileRes.json();
        const saved = savedRes.ok ? await savedRes.json() : [];
        const searchData = searchRes.ok ? await searchRes.json() : { grants: [] };

        setData({
          savedCount: Array.isArray(saved) ? saved.length : 0,
          searchCount: profile.searchHistory?.length ?? 0,
          hasCompany: !!profile.company,
          recentSearches: profile.searchHistory?.slice(0, 5) ?? [],
          recommendedGrants: searchData.grants?.slice(0, 5) ?? [],
        });
      } catch (error) {
        console.error("Dashboard load error:", error);
        setData({
          savedCount: 0,
          searchCount: 0,
          hasCompany: false,
          recentSearches: [],
          recommendedGrants: [],
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to GrantFinder. Find UK business grants matched to your
          company profile.
        </p>
      </div>

      <StatsOverview
        savedCount={data.savedCount}
        searchCount={data.searchCount}
        hasCompany={data.hasCompany}
      />

      {!data.hasCompany && (
        <Card className="border-blue-200 bg-blue-50">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">
                Link your company
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Connect your Companies House profile to get personalised grant
                recommendations based on your industry.
              </p>
            </div>
            <Link href="/company">
              <Button size="sm">Link company</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSearches searches={data.recentSearches} />
        <RecommendedGrants grants={data.recommendedGrants} />
      </div>
    </div>
  );
}
