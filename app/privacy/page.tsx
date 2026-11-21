import type { Metadata } from "next";
import { completeSeller } from "@/content/legal/seller";
import { privacyPolicy } from "@/content/legal/privacy";
import { LegalDocument, LegalPending } from "../legal/LegalDocument";

// Set to true once guest and organiser emails (Resend) are live, so the page lists them.
const EMAILS_ON = false;

export const metadata: Metadata = {
  title: "Privacy | Three Hellos",
  description: "What Three Hellos collects from organisers and guests, who sees it, and when it is deleted.",
};

export default function PrivacyPage() {
  const s = completeSeller();
  if (!s) return <LegalPending title="Privacy" current="/privacy" />;
  return <LegalDocument page={privacyPolicy(s, { emailsOn: EMAILS_ON })} current="/privacy" />;
}
