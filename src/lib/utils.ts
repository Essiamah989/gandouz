import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a numeric or string price to Tunisian Dinar format with comma separating dinars and millimes (e.g., 12,5 DT or 12,500 DT).
 */
export function formatPrice(amount: number | string | null | undefined, unit: string = "DT"): string {
  if (amount === null || amount === undefined || amount === "") return `0 ${unit}`;
  const num = typeof amount === "number" ? amount : parsePrice(amount);
  if (isNaN(num)) return `0 ${unit}`;

  // Formats using French locale with comma as decimal separator
  const formatted = num.toLocaleString("fr-FR", {
    minimumFractionDigits: num % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 3,
  });

  return `${formatted} ${unit}`;
}

/**
 * Parses price input strings that may use commas (e.g. "12,5", "12,5 dt", "12,500 DT", "12.5") into a standard number.
 */
export function parsePrice(input: string | number | null | undefined): number {
  if (input === null || input === undefined || input === "") return 0;
  if (typeof input === "number") return isNaN(input) ? 0 : input;

  // Clean string: remove non-numeric chars except '.' and ',' and '-'
  const cleaned = input
    .toString()
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

