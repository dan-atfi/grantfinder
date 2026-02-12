import { grantRegistry } from "./provider-registry";
import { GtrProvider } from "./providers/gtr-provider";
import { DataGovProvider } from "./providers/datagov-provider";
import type { GrantSearchParams, GrantDetail, NormalizedGrant } from "./types";

// Register all providers
grantRegistry.register(new GtrProvider());
grantRegistry.register(new DataGovProvider());

export async function searchGrants(params: GrantSearchParams) {
  return grantRegistry.searchAll(params);
}

export async function getGrantById(
  compositeId: string
): Promise<GrantDetail | null> {
  return grantRegistry.getById(compositeId);
}

export { grantRegistry };
export type { GrantSearchParams, GrantDetail, NormalizedGrant };
