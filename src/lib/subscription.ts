import { prisma } from "./prisma";
import { SUBSCRIPTION_PLANS, PlanType } from "./lemonsqueezy";
import { SubscriptionStatus } from "@prisma/client";

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  return subscription;
}

/**
 * Check if user has an active subscription
 */
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return ["ACTIVE", "ON_TRIAL"].includes(status);
}

/**
 * Get user's current plan
 */
export async function getUserPlan(userId: string): Promise<PlanType> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || !isSubscriptionActive(subscription.status)) {
    return "FREE";
  }

  return subscription.plan as PlanType;
}

/**
 * Check if user can perform a search (based on monthly limits)
 */
export async function canPerformSearch(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: PlanType;
}> {
  const plan = await getUserPlan(userId);
  const planConfig = SUBSCRIPTION_PLANS[plan];
  const limit = planConfig.limits.searches;

  // Unlimited searches
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity, plan };
  }

  // Count searches this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const searchCount = await prisma.searchHistory.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  const remaining = Math.max(0, limit - searchCount);
  const allowed = searchCount < limit;

  return { allowed, remaining, limit, plan };
}

/**
 * Check if user can save more grants
 */
export async function canSaveGrant(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: PlanType;
}> {
  const plan = await getUserPlan(userId);
  const planConfig = SUBSCRIPTION_PLANS[plan];
  const limit = planConfig.limits.savedGrants;

  // Unlimited saved grants
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity, plan };
  }

  const savedCount = await prisma.savedGrant.count({
    where: { userId },
  });

  const remaining = Math.max(0, limit - savedCount);
  const allowed = savedCount < limit;

  return { allowed, remaining, limit, plan };
}

/**
 * Get usage statistics for user
 */
export async function getUserUsageStats(userId: string) {
  const plan = await getUserPlan(userId);

  // Get current month's search count
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [searchCount, savedCount] = await Promise.all([
    prisma.searchHistory.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.savedGrant.count({
      where: { userId },
    }),
  ]);

  const planConfig = SUBSCRIPTION_PLANS[plan];

  return {
    plan,
    searches: {
      used: searchCount,
      limit: planConfig.limits.searches,
      remaining:
        planConfig.limits.searches === Infinity
          ? Infinity
          : Math.max(0, planConfig.limits.searches - searchCount),
    },
    savedGrants: {
      used: savedCount,
      limit: planConfig.limits.savedGrants,
      remaining:
        planConfig.limits.savedGrants === Infinity
          ? Infinity
          : Math.max(0, planConfig.limits.savedGrants - savedCount),
    },
  };
}
