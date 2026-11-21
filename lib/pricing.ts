// Pricing (set during the race on Sat 21 Nov 2026):
// 1. Free: up to 4 guests per event (the smallest room that can be matched).
// 2. Pay per guest: €1 for each guest above what the event already covers.
//    A payment covers exactly the guests waiting at that moment; later
//    arrivals are paid the same way.
// 3. Unlimited: €9 once for 30 days of events with any number of guests,
//    recognised by the organiser's email. Cheaper than pay per guest as soon
//    as more than 9 extra guests are waiting, so from 14 guests.

export const FREE_GUESTS = 4;
export const CENTS_PER_GUEST = 100;
export const MIN_CHARGE_CENTS = 100;
export const PASS_PRICE_CENTS = 900;
export const PASS_DAYS = 30;
/** Safety cap per event even with the pass, to keep one matching run reasonable. */
export const MAX_GUESTS_PER_EVENT = 500;

/** What a pay-per-guest payment costs now, and the guest limit it buys. */
export function guestTopUp(guestCount: number, coveredLimit: number): { cents: number; newLimit: number; extraGuests: number } {
  const extraGuests = Math.max(1, guestCount - coveredLimit);
  const cents = Math.max(MIN_CHARGE_CENTS, extraGuests * CENTS_PER_GUEST);
  const newLimit = Math.min(MAX_GUESTS_PER_EVENT, coveredLimit + Math.floor(cents / CENTS_PER_GUEST));
  return { cents, newLimit, extraGuests };
}

/** True when the 30-day pass costs less than paying for these guests one by one. */
export function passIsCheaper(cents: number): boolean {
  return PASS_PRICE_CENTS < cents;
}

/** "€1", "€12", "€9" */
export function euros(cents: number): string {
  return cents % 100 === 0 ? `€${cents / 100}` : `€${(cents / 100).toFixed(2)}`;
}
