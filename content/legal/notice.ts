// Legal notice for /legal. Build it with completeSeller(); render nothing if that returns null.
import { fixed, type CompleteSeller, type LegalPage } from "./seller";

export function legalNotice(s: CompleteSeller): LegalPage {
  const statusLine =
    s.businessStatus === "sole trader"
      ? `${s.fullName} runs ${fixed.productName} as a sole trader registered in ${fixed.country}.`
      : `${s.fullName} runs ${fixed.productName} as a private individual based in ${fixed.country}.`;

  const registration: string[] = [];
  if (s.registrationNumber) registration.push(`Sole trader registration number: ${s.registrationNumber}`);
  if (s.taxNumber) registration.push(`Tax number: ${s.taxNumber}`);
  if (s.vatStatus === "registered" && s.vatNumber) registration.push(`EU VAT number: ${s.vatNumber}`);
  if (s.vatStatus === "exempt") registration.push("VAT: not charged, the seller is exempt from VAT.");

  return {
    title: "Legal notice",
    lastUpdated: fixed.lastUpdated,
    intro: `${fixed.productName} (${fixed.website}) is an online service that suggests introductions between guests of an event.`,
    sections: [
      {
        heading: "Who runs this service",
        paragraphs: [statusLine, `Postal address: ${s.postalAddress}`, `Email: ${s.contactEmail}`],
      },
      ...(registration.length ? [{ heading: "Registration and tax", paragraphs: registration }] : []),
      {
        heading: "Hosting",
        paragraphs: [
          `The site is hosted by ${fixed.hostingName}, ${s.hostingAddress} (${fixed.hostingWebsite}).`,
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `For any question about the service, a payment or your data, write to ${s.contactEmail}. We aim to answer within two working days.`,
        ],
      },
    ],
  };
}
