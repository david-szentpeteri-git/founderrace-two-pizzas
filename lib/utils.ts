/** Joins class names, skipping empty values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "Sat 29 Nov, 19:00" in the viewer's locale-neutral English format. */
export function formatEventDate(iso: string | null, timeZone?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timeZone ?? "UTC",
  });
}
