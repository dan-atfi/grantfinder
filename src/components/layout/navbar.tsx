"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const res = await fetch("/api/auth/signout", { method: "POST" });
    if (res.ok) {
      router.push("/sign-in");
      router.refresh();
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
          <span className="text-sm text-gray-600">
            {userName || "User"}
          </span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
