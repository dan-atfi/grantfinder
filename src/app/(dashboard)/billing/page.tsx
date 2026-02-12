"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  getCurrentSubscription,
  getCustomerPortalUrl,
} from "@/app/actions/subscription";
import { getUserUsageStats } from "@/lib/subscription";
import { SUBSCRIPTION_PLANS } from "@/lib/lemonsqueezy";
import { SubscriptionStatus } from "@prisma/client";

interface Subscription {
  id: string;
  plan: keyof typeof SUBSCRIPTION_PLANS;
  status: SubscriptionStatus;
  renewsAt: string | null;
  endsAt: string | null;
  trialEndsAt: string | null;
  isPaused: boolean;
}

interface UsageStats {
  plan: keyof typeof SUBSCRIPTION_PLANS;
  searches: {
    used: number;
    limit: number;
    remaining: number;
  };
  savedGrants: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subData, usageData] = await Promise.all([
        getCurrentSubscription(),
        fetch("/api/user/usage")
          .then((res) => res.json())
          .catch(() => null),
      ]);

      setSubscription(subData as Subscription | null);
      setUsageStats(usageData);
    } catch (error) {
      console.error("Failed to load billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const portalUrl = await getCustomerPortalUrl();
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      alert("Failed to open billing portal. Please try again.");
      setIsManaging(false);
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const statusConfig = {
      ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
      ON_TRIAL: { label: "Trial", className: "bg-blue-100 text-blue-800" },
      PAUSED: { label: "Paused", className: "bg-yellow-100 text-yellow-800" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
      EXPIRED: { label: "Expired", className: "bg-gray-100 text-gray-800" },
      PAST_DUE: { label: "Past Due", className: "bg-orange-100 text-orange-800" },
      UNPAID: { label: "Unpaid", className: "bg-red-100 text-red-800" },
      FREE: { label: "Free", className: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status] || statusConfig.FREE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatUsage = (used: number, limit: number) => {
    if (limit === Infinity) return `${used} / Unlimited`;
    return `${used} / ${limit}`;
  };

  const getProgressPercentage = (used: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || "FREE";
  const planConfig = SUBSCRIPTION_PLANS[currentPlan];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
              <p className="text-gray-600 mt-1">
                {subscription
                  ? `You are on the ${planConfig.name} plan`
                  : "You are on the Free plan"}
              </p>
            </div>
            {subscription && getStatusBadge(subscription.status)}
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Plan Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Plan:</dt>
                  <dd className="text-gray-900 font-medium">{planConfig.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Price:</dt>
                  <dd className="text-gray-900 font-medium">
                    £{planConfig.price}/month
                  </dd>
                </div>
                {subscription?.renewsAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Renews:</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatDate(subscription.renewsAt)}
                    </dd>
                  </div>
                )}
                {subscription?.endsAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Ends:</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatDate(subscription.endsAt)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {planConfig.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {subscription && ["ACTIVE", "ON_TRIAL", "PAST_DUE"].includes(subscription.status) ? (
              <Button
                onClick={handleManageSubscription}
                isLoading={isManaging}
                variant="outline"
              >
                Manage Subscription
              </Button>
            ) : (
              <Button onClick={() => (window.location.href = "/pricing")}>
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Usage Statistics */}
      {usageStats && (
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Usage This Month</h2>

            <div className="space-y-6">
              {/* Searches */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Grant Searches
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatUsage(
                      usageStats.searches.used,
                      usageStats.searches.limit
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${getProgressPercentage(
                        usageStats.searches.used,
                        usageStats.searches.limit
                      )}%`,
                    }}
                  />
                </div>
                {usageStats.searches.remaining !== Infinity &&
                  usageStats.searches.remaining <= 5 && (
                    <p className="text-xs text-orange-600 mt-1">
                      {usageStats.searches.remaining} searches remaining this
                      month
                    </p>
                  )}
              </div>

              {/* Saved Grants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Saved Grants
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatUsage(
                      usageStats.savedGrants.used,
                      usageStats.savedGrants.limit
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${getProgressPercentage(
                        usageStats.savedGrants.used,
                        usageStats.savedGrants.limit
                      )}%`,
                    }}
                  />
                </div>
                {usageStats.savedGrants.limit !== Infinity &&
                  usageStats.savedGrants.remaining <= 2 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Only {usageStats.savedGrants.remaining} save slots
                      remaining
                    </p>
                  )}
              </div>
            </div>

            {currentPlan === "FREE" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900">
                  💡 Upgrade to unlock unlimited searches and saves.{" "}
                  <a href="/pricing" className="underline font-medium">
                    View plans
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Payment History would go here in a real implementation */}
    </div>
  );
}
