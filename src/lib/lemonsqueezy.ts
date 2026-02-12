import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// Initialize Lemon Squeezy
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => {
    console.error("Lemon Squeezy Error:", error);
  },
});

// Plan configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    currency: "GBP",
    variantId: null,
    features: [
      "5 grant searches per month",
      "Basic grant information",
      "Save up to 10 grants",
      "Email support",
    ],
    limits: {
      searches: 5,
      savedGrants: 10,
    },
  },
  STARTER: {
    name: "Starter",
    price: 29,
    currency: "GBP",
    variantId: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID!,
    features: [
      "50 grant searches per month",
      "Advanced search filters",
      "Save unlimited grants",
      "Export to CSV",
      "Email & chat support",
    ],
    limits: {
      searches: 50,
      savedGrants: Infinity,
    },
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 99,
    currency: "GBP",
    variantId: process.env.LEMONSQUEEZY_PROFESSIONAL_VARIANT_ID!,
    features: [
      "Unlimited grant searches",
      "All Starter features",
      "Grant deadline alerts",
      "Priority matching algorithm",
      "API access",
      "Dedicated account manager",
    ],
    limits: {
      searches: Infinity,
      savedGrants: Infinity,
    },
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;
