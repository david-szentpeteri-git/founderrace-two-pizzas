// The seller's legal details, used by /legal, /terms and /privacy.
// David fills these in. Until every required value is set, `missingSellerDetails`
// lists what is missing and the legal pages should not go live.
// Never put a value here that has not been checked by David.

export type BusinessStatus = "sole trader" | "private individual";
export type VatStatus = "registered" | "exempt";

export type SellerDetails = {
  fullName: string | null;
  postalAddress: string | null;
  contactEmail: string | null;
  businessStatus: BusinessStatus | null;
  // Sole trader registration number (Hungarian sole trader register). Required for a sole trader.
  registrationNumber: string | null;
  // Hungarian tax number. Required for a sole trader.
  taxNumber: string | null;
  // "registered" means the €29 price includes VAT. "exempt" means no VAT is charged.
  vatStatus: VatStatus | null;
  // EU VAT number, only when vatStatus is "registered".
  vatNumber: string | null;
  // The hosting provider's postal address as stated on its own legal page.
  hostingAddress: string | null;
};

// Checked by David on Sat 21 Nov 2026 (19:00 SGT): city-only address by choice,
// product email instead of a personal one, private individual without a tax number.
export const seller: SellerDetails = {
  fullName: "David Szentpeteri",
  postalAddress: "Budapest, Hungary",
  contactEmail: "threehellos3@gmail.com",
  businessStatus: "private individual",
  registrationNumber: null,
  taxNumber: null,
  vatStatus: "exempt",
  vatNumber: null,
  // As given in Vercel's terms of service (https://vercel.com/legal/terms).
  hostingAddress: "440 N Barranca Ave #4133, Covina, CA 91723, United States",
};

// Facts the plan already fixes.
export const fixed = {
  productName: "Three Hellos",
  website: "https://threehellos.app",
  country: "Hungary",
  lastUpdated: "21 November 2026",
  hostingName: "Vercel Inc.",
  hostingWebsite: "https://vercel.com",
  supervisoryAuthority: {
    name: "the Hungarian National Authority for Data Protection and Freedom of Information (NAIH)",
    website: "https://naih.hu",
  },
} as const;

export type CompleteSeller = {
  [K in keyof SellerDetails]: K extends "registrationNumber" | "taxNumber" | "vatNumber"
    ? string | null
    : NonNullable<SellerDetails[K]>;
};

export function missingSellerDetails(s: SellerDetails = seller): string[] {
  const missing: string[] = [];
  if (!s.fullName) missing.push("fullName");
  if (!s.postalAddress) missing.push("postalAddress");
  if (!s.contactEmail) missing.push("contactEmail");
  if (!s.businessStatus) missing.push("businessStatus");
  if (s.businessStatus === "sole trader") {
    if (!s.registrationNumber) missing.push("registrationNumber");
    if (!s.taxNumber) missing.push("taxNumber");
  }
  if (!s.vatStatus) missing.push("vatStatus");
  if (s.vatStatus === "registered" && !s.vatNumber) missing.push("vatNumber");
  if (!s.hostingAddress) missing.push("hostingAddress");
  return missing;
}

// Shape shared by the three legal pages.
export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalPage = { title: string; lastUpdated: string; intro: string; sections: LegalSection[] };

// Returns the details when complete, or null so the page can show nothing instead of blanks.
export function completeSeller(s: SellerDetails = seller): CompleteSeller | null {
  return missingSellerDetails(s).length === 0 ? (s as CompleteSeller) : null;
}
