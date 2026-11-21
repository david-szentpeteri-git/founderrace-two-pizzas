/**
 * Public base URL of the site, without a trailing slash. Order:
 * 1. NEXT_PUBLIC_SITE_URL if set (local development, or a forced value);
 * 2. VERCEL_PROJECT_PRODUCTION_URL, set by Vercel to the project's production
 *    domain (the custom domain once added, else the .vercel.app one);
 * 3. VERCEL_URL (this deployment); 4. localhost.
 */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const FREE_GUEST_LIMIT = 15;
export const PAID_GUEST_LIMIT = 150;
export const EVENT_PRICE_EUR_CENTS = 2900;
export const MIN_GUESTS_TO_MATCH = 4;
