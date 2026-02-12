import { Badge } from "@/components/ui/badge";

const sourceConfig: Record<string, { label: string; variant: "blue" | "green" | "purple" }> = {
  gtr: { label: "UKRI", variant: "blue" },
  datagov: { label: "Data.gov.uk", variant: "green" },
  findagrant: { label: "Find a Grant", variant: "purple" },
};

export function GrantSourceBadge({ source }: { source: string }) {
  const config = sourceConfig[source] ?? {
    label: source,
    variant: "blue" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
