"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  createCheckout,
  getCustomer,
  listSubscriptions,
} from "@lemonsqueezy/lemonsqueezy.js";
import { prisma } from "@/lib/prisma";

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(variantId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user already has an active subscription
  if (
    user.subscription &&
    ["ACTIVE", "ON_TRIAL"].includes(user.subscription.status)
  ) {
    throw new Error("You already have an active subscription");
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  // Create checkout session
  const checkout = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: user.email,
      custom: {
        user_id: user.id,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    },
  });

  if (checkout.error) {
    throw new Error(checkout.error.message);
  }

  // Redirect to checkout page
  redirect(checkout.data!.data.attributes.url);
}

/**
 * Get customer portal URL
 */
export async function getCustomerPortalUrl() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.lemonSqueezyCustomerId) {
    throw new Error("No subscription found");
  }

  // Get customer details
  const customer = await getCustomer(subscription.lemonSqueezyCustomerId);

  if (customer.error) {
    throw new Error(customer.error.message);
  }

  const portalUrl = customer.data!.data.attributes.urls.customer_portal;

  return portalUrl;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.lemonSqueezySubscriptionId) {
    throw new Error("No subscription found");
  }

  // Get portal URL and redirect - user can cancel from there
  const portalUrl = await getCustomerPortalUrl();
  redirect(portalUrl);
}

/**
 * Update subscription (upgrade/downgrade)
 */
export async function updateSubscription(newVariantId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.lemonSqueezySubscriptionId) {
    throw new Error("No subscription found");
  }

  // Get portal URL and redirect - user can change plan from there
  const portalUrl = await getCustomerPortalUrl();
  redirect(portalUrl);
}

/**
 * Get current user's subscription status
 */
export async function getCurrentSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  return subscription;
}

/**
 * Sync subscription from Lemon Squeezy
 */
export async function syncSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.lemonSqueezyCustomerId) {
    throw new Error("No subscription found");
  }

  // Fetch latest subscription data from Lemon Squeezy
  const subscriptions = await listSubscriptions({
    filter: {
      customerId: subscription.lemonSqueezyCustomerId,
    },
  });

  if (subscriptions.error) {
    throw new Error(subscriptions.error.message);
  }

  // This will be handled by the webhook in production
  // For now, just return the current subscription
  return subscription;
}
