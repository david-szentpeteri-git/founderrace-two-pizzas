/** Public base URL of the site, without a trailing slash. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const FREE_GUEST_LIMIT = 15;
export const PAID_GUEST_LIMIT = 150;
export const EVENT_PRICE_EUR_CENTS = 2900;
export const MIN_GUESTS_TO_MATCH = 4;
