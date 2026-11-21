import type { Metadata } from "next";
import { completeSeller } from "@/content/legal/seller";
import { legalNotice } from "@/content/legal/notice";
import { LegalDocument, LegalPending } from "./LegalDocument";

// Seller details live in content/legal/seller.ts. Until they are all set,
// this page shows a short pending note instead of blanks.

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Who runs Three Hellos, where it is hosted and how to contact us.",
};

export default function LegalNoticePage() {
  const s = completeSeller();
  if (!s) return <LegalPending title="Legal notice" current="/legal" />;
  return <LegalDocument page={legalNotice(s)} current="/legal" />;
}
