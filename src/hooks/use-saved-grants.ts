"use client";

import { useState, useEffect, useCallback } from "react";

interface SavedGrant {
  id: string;
  grantSource: string;
  externalId: string;
  title: string;
  description?: string | null;
  fundingBody?: string | null;
  amountMin?: number | null;
  amountMax?: number | null;
  currency?: string | null;
  openDate?: string | null;
  closeDate?: string | null;
  applicationUrl?: string | null;
  categories: string[];
  notes?: string | null;
  createdAt: string;
}

export function useSavedGrants() {
  const [savedGrants, setSavedGrants] = useState<SavedGrant[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grants/saved")
      .then((res) => res.json())
      .then((data: SavedGrant[]) => {
        setSavedGrants(data);
        setSavedIds(
          new Set(data.map((g) => `${g.grantSource}:${g.externalId}`))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const saveGrant = useCallback(
    async (grant: {
      source: string;
      externalId: string;
      title: string;
      description?: string;
      fundingBody?: string;
      amountMin?: number;
      amountMax?: number;
      currency?: string;
      openDate?: string;
      closeDate?: string;
      applicationUrl?: string;
      categories?: string[];
    }) => {
      // Optimistic update
      const compositeId = `${grant.source}:${grant.externalId}`;
      setSavedIds((prev) => new Set(prev).add(compositeId));

      try {
        const res = await fetch("/api/grants/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grantSource: grant.source,
            externalId: grant.externalId,
            title: grant.title,
            description: grant.description,
            fundingBody: grant.fundingBody,
            amountMin: grant.amountMin,
            amountMax: grant.amountMax,
            currency: grant.currency,
            openDate: grant.openDate,
            closeDate: grant.closeDate,
            applicationUrl: grant.applicationUrl,
            categories: grant.categories,
          }),
        });

        if (res.ok) {
          const saved: SavedGrant = await res.json();
          setSavedGrants((prev) => [saved, ...prev]);
        } else {
          // Rollback
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(compositeId);
            return next;
          });
        }
      } catch {
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(compositeId);
          return next;
        });
      }
    },
    []
  );

  const unsaveGrant = useCallback(
    async (source: string, externalId: string) => {
      const compositeId = `${source}:${externalId}`;
      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(compositeId);
        return next;
      });
      setSavedGrants((prev) =>
        prev.filter(
          (g) => !(g.grantSource === source && g.externalId === externalId)
        )
      );

      try {
        await fetch(
          `/api/grants/saved?source=${source}&externalId=${encodeURIComponent(externalId)}`,
          { method: "DELETE" }
        );
      } catch {
        // Rollback
        setSavedIds((prev) => new Set(prev).add(compositeId));
      }
    },
    []
  );

  const isSaved = useCallback(
    (source: string, externalId: string) => {
      return savedIds.has(`${source}:${externalId}`);
    },
    [savedIds]
  );

  return { savedGrants, isLoading, saveGrant, unsaveGrant, isSaved };
}
