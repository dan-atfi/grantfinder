import { Badge } from "@/components/ui/badge";

interface SicCode {
  code: string;
  description?: string | null;
  section?: string | null;
}

const sectionColors: Record<string, "blue" | "green" | "yellow" | "red" | "purple" | "default"> = {
  A: "green",
  B: "yellow",
  C: "blue",
  D: "yellow",
  E: "green",
  F: "red",
  G: "purple",
  H: "blue",
  I: "yellow",
  J: "blue",
  K: "green",
  L: "purple",
  M: "blue",
  N: "default",
  O: "red",
  P: "green",
  Q: "red",
  R: "purple",
  S: "default",
};

export function SicCodeBadges({ sicCodes }: { sicCodes: SicCode[] }) {
  if (!sicCodes.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {sicCodes.map((sic) => (
        <Badge
          key={sic.code}
          variant={sectionColors[sic.section ?? ""] ?? "default"}
          title={sic.description ?? sic.code}
        >
          {sic.code}
          {sic.description && (
            <span className="ml-1 hidden sm:inline">
              - {sic.description}
            </span>
          )}
        </Badge>
      ))}
    </div>
  );
}
