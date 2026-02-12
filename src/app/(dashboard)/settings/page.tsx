"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully." });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings.</p>
      </div>

      <Card>
        <CardTitle>Profile</CardTitle>

        {message && (
          <div
            className={`mt-3 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 -mt-2">
            Email cannot be changed.
          </p>

          <Button type="submit" isLoading={isSaving}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
