// Pricing (decided by Daniel and David, Sat 21 Nov 13:33 Paris):
// 1. Free: up to 15 guests per event.
// 2. Pay per guest: 2 cents for each guest above what is covered, at least 1 EUR
//    per payment. Every payment buys guest places at 2 cents each, so 1 EUR buys
//    50 places (16 to 65 guests); 150 guests cost 2.70 in one go.
// 3. Unlimited: 9 EUR once for 30 days of events with any number of guests,
//    recognised by the organiser's email.

export const FREE_GUESTS = 15;
export const CENTS_PER_GUEST = 2;
export const MIN_CHARGE_CENTS = 100;
export const PASS_PRICE_CENTS = 900;
export const PASS_DAYS = 30;
/** Safety cap per event even with the pass, to keep one matching run reasonable. */
export const MAX_GUESTS_PER_EVENT = 500;

/** What a pay-per-guest payment costs now, and the guest limit it buys. */
export function guestTopUp(guestCount: number, coveredLimit: number): { cents: number; newLimit: number; extraGuests: number } {
  const extraGuests = Math.max(0, guestCount - coveredLimit);
  const cents = Math.max(MIN_CHARGE_CENTS, extraGuests * CENTS_PER_GUEST);
  const newLimit = Math.min(MAX_GUESTS_PER_EVENT, coveredLimit + Math.floor(cents / CENTS_PER_GUEST));
  return { cents, newLimit, extraGuests };
}

/** "€1.00", "€2.70", "€9" */
export function euros(cents: number): string {
  return cents % 100 === 0 ? `€${cents / 100}` : `€${(cents / 100).toFixed(2)}`;
}
