"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.details.fieldErrors || {})) {
            fieldErrors[key] = (msgs as string[])[0];
          }
          setErrors(fieldErrors);
        } else {
          setGlobalError(data.error || "Registration failed");
        }
        return;
      }

      // Auto sign-in after registration
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Account created but sign-in failed. Please sign in manually.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setGlobalError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {globalError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {globalError}
        </div>
      )}

      <Input
        label="Full name"
        name="name"
        type="text"
        placeholder="John Smith"
        required
        autoComplete="name"
        error={errors.name}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.co.uk"
        required
        autoComplete="email"
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min 8 chars, 1 uppercase, 1 number"
        required
        autoComplete="new-password"
        error={errors.password}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create account
      </Button>
    </form>
  );
}
