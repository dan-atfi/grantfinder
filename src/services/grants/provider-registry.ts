import type {
  GrantProvider,
  GrantSearchParams,
  GrantDetail,
  NormalizedGrant,
} from "./types";

class GrantProviderRegistry {
  private providers: Map<string, GrantProvider> = new Map();

  register(provider: GrantProvider): void {
    this.providers.set(provider.source, provider);
  }

  unregister(source: string): void {
    this.providers.delete(source);
  }

  getProvider(source: string): GrantProvider | undefined {
    return this.providers.get(source);
  }

  getEnabledProviders(): GrantProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.enabled);
  }

  async searchAll(params: GrantSearchParams): Promise<{
    grants: NormalizedGrant[];
    totalResults: number;
    page: number;
    pageSize: number;
    sourceBreakdown: Record<string, number>;
  }> {
    const providers = this.getEnabledProviders();

    const results = await Promise.allSettled(
      providers.map((provider) => provider.search(params))
    );

    const allGrants: NormalizedGrant[] = [];
    const sourceBreakdown: Record<string, number> = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        allGrants.push(...result.value.grants);
        sourceBreakdown[result.value.source] = result.value.totalResults;
      } else {
        console.error("Provider search failed:", result.reason);
      }
    }

    // Sort: open first, then by close date ascending
    allGrants.sort((a, b) => {
      const statusOrder = { open: 0, upcoming: 1, unknown: 2, closed: 3 };
      const diff = statusOrder[a.status] - statusOrder[b.status];
      if (diff !== 0) return diff;
      if (a.closeDate && b.closeDate) {
        return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
      }
      return 0;
    });

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    const paged = allGrants.slice(start, start + pageSize);

    return {
      grants: paged,
      totalResults: allGrants.length,
      page,
      pageSize,
      sourceBreakdown,
    };
  }

  async getById(compositeId: string): Promise<GrantDetail | null> {
    const [source, ...rest] = compositeId.split(":");
    const externalId = rest.join(":");
    const provider = this.getProvider(source);
    if (!provider) return null;
    return provider.getById(externalId);
  }
}

export const grantRegistry = new GrantProviderRegistry();
