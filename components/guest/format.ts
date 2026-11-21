/** Formats an ISO date for event headers, e.g. "Sat 21 Nov, 19:00". */
export function formatEventTime(iso: string | null, timeZone?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: safeTimeZone(timeZone),
  }).format(date);
}

/** The organiser's IANA zone when it is valid, otherwise Paris time. */
export function safeTimeZone(timeZone?: string | null): string {
  if (!timeZone) return "Europe/Paris";
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone });
    return timeZone;
  } catch {
    return "Europe/Paris";
  }
}
