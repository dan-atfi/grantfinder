import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus, SubscriptionPlan } from "@prisma/client";

// Webhook event types from Lemon Squeezy
type WebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      status: string;
      renews_at: string | null;
      ends_at: string | null;
      trial_ends_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
};

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

/**
 * Map Lemon Squeezy status to our SubscriptionStatus enum
 */
function mapStatus(lsStatus: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    active: "ACTIVE",
    on_trial: "ON_TRIAL",
    paused: "PAUSED",
    past_due: "PAST_DUE",
    unpaid: "UNPAID",
    cancelled: "CANCELLED",
    expired: "EXPIRED",
  };

  return statusMap[lsStatus] || "CANCELLED";
}

/**
 * Determine plan based on variant ID
 */
function getPlanFromVariantId(variantId: string): SubscriptionPlan {
  const starterVariantId = process.env.LEMONSQUEEZY_STARTER_VARIANT_ID;
  const professionalVariantId = process.env.LEMONSQUEEZY_PROFESSIONAL_VARIANT_ID;

  if (variantId === starterVariantId) return "STARTER";
  if (variantId === professionalVariantId) return "PROFESSIONAL";

  return "FREE";
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(event: WebhookEvent) {
  const { attributes } = event.data;
  const userId = event.meta.custom_data?.user_id;

  if (!userId) {
    console.error("No user_id in webhook custom_data");
    return;
  }

  const plan = getPlanFromVariantId(attributes.variant_id.toString());
  const status = mapStatus(attributes.status);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      lemonSqueezyCustomerId: attributes.customer_id.toString(),
      lemonSqueezySubscriptionId: attributes.id,
      lemonSqueezyVariantId: attributes.variant_id.toString(),
      lemonSqueezyProductId: attributes.product_id.toString(),
      lemonSqueezyOrderId: attributes.order_id.toString(),
      plan,
      status,
      renewsAt: attributes.renews_at ? new Date(attributes.renews_at) : null,
      endsAt: attributes.ends_at ? new Date(attributes.ends_at) : null,
      trialEndsAt: attributes.trial_ends_at
        ? new Date(attributes.trial_ends_at)
        : null,
    },
    create: {
      userId,
      lemonSqueezyCustomerId: attributes.customer_id.toString(),
      lemonSqueezySubscriptionId: attributes.id,
      lemonSqueezyVariantId: attributes.variant_id.toString(),
      lemonSqueezyProductId: attributes.product_id.toString(),
      lemonSqueezyOrderId: attributes.order_id.toString(),
      plan,
      status,
      renewsAt: attributes.renews_at ? new Date(attributes.renews_at) : null,
      endsAt: attributes.ends_at ? new Date(attributes.ends_at) : null,
      trialEndsAt: attributes.trial_ends_at
        ? new Date(attributes.trial_ends_at)
        : null,
    },
  });

  console.log(`Subscription created for user ${userId}`);
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(event: WebhookEvent) {
  const { attributes } = event.data;
  const subscriptionId = attributes.id;

  const plan = getPlanFromVariantId(attributes.variant_id.toString());
  const status = mapStatus(attributes.status);

  await prisma.subscription.update({
    where: { lemonSqueezySubscriptionId: subscriptionId },
    data: {
      plan,
      status,
      renewsAt: attributes.renews_at ? new Date(attributes.renews_at) : null,
      endsAt: attributes.ends_at ? new Date(attributes.ends_at) : null,
      trialEndsAt: attributes.trial_ends_at
        ? new Date(attributes.trial_ends_at)
        : null,
      isPaused: attributes.status === "paused",
    },
  });

  console.log(`Subscription updated: ${subscriptionId}`);
}

/**
 * Handle subscription cancelled/expired event
 */
async function handleSubscriptionEnded(event: WebhookEvent) {
  const { attributes } = event.data;
  const subscriptionId = attributes.id;

  await prisma.subscription.update({
    where: { lemonSqueezySubscriptionId: subscriptionId },
    data: {
      status: "CANCELLED",
      plan: "FREE",
      endsAt: new Date(),
    },
  });

  console.log(`Subscription cancelled: ${subscriptionId}`);
}

/**
 * Main webhook handler
 */
export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const payload = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      console.error("No signature header");
      return NextResponse.json(
        { error: "No signature header" },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifySignature(payload, signature)) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the event
    const event: WebhookEvent = JSON.parse(payload);
    const eventName = event.meta.event_name;

    console.log(`Received webhook: ${eventName}`);

    // Handle different event types
    switch (eventName) {
      case "subscription_created":
        await handleSubscriptionCreated(event);
        break;

      case "subscription_updated":
        await handleSubscriptionUpdated(event);
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionEnded(event);
        break;

      case "subscription_resumed":
        await handleSubscriptionUpdated(event);
        break;

      case "subscription_paused":
      case "subscription_unpaused":
        await handleSubscriptionUpdated(event);
        break;

      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
