"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { handleSignOut } from "@/app/actions/auth";
import { Badge } from "@/components/ui/badge";
import { getCurrentSubscription } from "@/app/actions/subscription";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const [plan, setPlan] = useState<string>("FREE");

  useEffect(() => {
    getCurrentSubscription().then((sub) => {
      if (sub && ["ACTIVE", "ON_TRIAL"].includes(sub.status)) {
        setPlan(sub.plan);
      }
    }).catch(console.error);
  }, []);

  const onSignOut = async () => {
    await handleSignOut();
  };

  const getPlanBadgeStyle = (planName: string) => {
    switch (planName) {
      case "PROFESSIONAL":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "STARTER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 lg:hidden">
            <Link href="/dashboard">GrantFinder</Link>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/billing"
            className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Badge className={getPlanBadgeStyle(plan)}>
              {plan.charAt(0) + plan.slice(1).toLowerCase()}
            </Badge>
          </Link>
          <span className="text-sm text-gray-600">
            {userName || "User"}
          </span>
          <button
            onClick={onSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
