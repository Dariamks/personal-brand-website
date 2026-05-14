/**
 * Format a date or date string as YYYY-MM-DD.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

/**
 * Return the difference in calendar days between two dates.
 * Positive when a is later than b.
 */
export function diffDays(a: Date | string, b: Date | string): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.floor((da.getTime() - db.getTime()) / (1000 * 60 * 60 * 24));
}
