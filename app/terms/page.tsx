import type { Metadata } from "next";
import { completeSeller } from "@/content/legal/seller";
import { termsOfSale } from "@/content/legal/terms";
import { LegalDocument, LegalPending } from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "Price, payment, what you get, refunds and the 14 day right to cancel for Three Hellos.",
};

export default function TermsPage() {
  const s = completeSeller();
  if (!s) return <LegalPending title="Terms of sale" current="/terms" />;
  return <LegalDocument page={termsOfSale(s)} current="/terms" />;
}
