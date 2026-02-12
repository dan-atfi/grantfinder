export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
