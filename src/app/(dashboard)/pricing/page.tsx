"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/app/actions/subscription";
import { SUBSCRIPTION_PLANS } from "@/lib/lemonsqueezy";

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (variantId: string | null, planName: string) => {
    if (!variantId) return;

    setLoadingPlan(planName);
    try {
      await createCheckoutSession(variantId);
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start checkout. Please try again."
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find the perfect plan for your grant search needs. All plans include
          our comprehensive UK grant database.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className="relative">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {SUBSCRIPTION_PLANS.FREE.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  £{SUBSCRIPTION_PLANS.FREE.price}
                </span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
            </div>

            <Button variant="outline" disabled className="w-full">
              Current Plan
            </Button>

            <ul className="space-y-3">
              {SUBSCRIPTION_PLANS.FREE.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Starter Plan */}
        <Card className="relative border-2 border-blue-500 shadow-lg">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0">
            <Badge className="bg-blue-500 text-white px-3 py-1">
              Most Popular
            </Badge>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {SUBSCRIPTION_PLANS.STARTER.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  £{SUBSCRIPTION_PLANS.STARTER.price}
                </span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
            </div>

            <Button
              onClick={() =>
                handleSubscribe(
                  SUBSCRIPTION_PLANS.STARTER.variantId,
                  "STARTER"
                )
              }
              isLoading={loadingPlan === "STARTER"}
              disabled={loadingPlan !== null}
              className="w-full"
            >
              Get Started
            </Button>

            <ul className="space-y-3">
              {SUBSCRIPTION_PLANS.STARTER.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Professional Plan */}
        <Card className="relative">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {SUBSCRIPTION_PLANS.PROFESSIONAL.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  £{SUBSCRIPTION_PLANS.PROFESSIONAL.price}
                </span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
            </div>

            <Button
              onClick={() =>
                handleSubscribe(
                  SUBSCRIPTION_PLANS.PROFESSIONAL.variantId,
                  "PROFESSIONAL"
                )
              }
              isLoading={loadingPlan === "PROFESSIONAL"}
              disabled={loadingPlan !== null}
              className="w-full"
              variant="outline"
            >
              Get Started
            </Button>

            <ul className="space-y-3">
              {SUBSCRIPTION_PLANS.PROFESSIONAL.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* FAQ or Additional Info */}
      <div className="bg-gray-50 rounded-lg p-6 mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">
              Can I change my plan later?
            </h4>
            <p className="text-gray-600 mt-1">
              Yes, you can upgrade or downgrade your plan at any time from your
              billing settings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              What payment methods do you accept?
            </h4>
            <p className="text-gray-600 mt-1">
              We accept all major credit cards through our secure payment
              processor, Lemon Squeezy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Is there a free trial?
            </h4>
            <p className="text-gray-600 mt-1">
              You can use the Free plan indefinitely. Paid plans can be
              cancelled at any time with no long-term commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
