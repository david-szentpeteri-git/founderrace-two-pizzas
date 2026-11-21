import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getAdminView } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { siteUrl } from "@/lib/site";
import { formatEventDate } from "@/lib/utils";
import { PosterPrintButton } from "./PosterPrintButton";

// A4 poster for the door: guests scan the QR code and join on their phone.

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Door poster",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = { params: Promise<{ adminToken: string }> };

export default async function PosterPage({ params }: Props) {
  const { adminToken } = await params;
  const view = hasDatabase() ? await getAdminView(adminToken) : null;

  if (!view) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-zinc-900">
        <h1 className="text-2xl font-semibold">We can&apos;t find this event</h1>
        <p className="mt-2 text-zinc-500">Open the poster from your organiser dashboard.</p>
      </main>
    );
  }

  const { event } = view;
  const joinUrl = `${siteUrl()}/e/${event.slug}`;
  const qrSvg = await QRCode.toString(joinUrl, { type: "svg", margin: 0, width: 520, errorCorrectionLevel: "M" });
  const when = formatEventDate(event.startsAt, event.timeZone);
  const shortUrl = joinUrl.replace(/^https?:\/\//, "");

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <style>{`
        @page { size: A4 portrait; margin: 14mm; }
        @media print { .no-print { display: none !important; } html, body { background: #fff; } }
      `}</style>

      <div className="no-print mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 pt-6">
        <Link href={`/o/${adminToken}`} className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline">
          Back to dashboard
        </Link>
        <PosterPrintButton />
      </div>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-10 pt-8 text-center print:pt-0">
        <p className="text-lg font-medium text-zinc-500">{[event.name, when].filter(Boolean).join(" · ")}</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Find the <span className="rounded-md bg-lime-300 px-2">three people</span> you should meet tonight
        </h1>
        <p className="mt-5 max-w-xl text-xl text-zinc-600">
          Scan, answer four quick questions, and you&apos;ll get three names, why, and a first question to ask.
        </p>
        <div
          className="mt-10 w-[min(80vw,520px)] [&>svg]:h-auto [&>svg]:w-full"
          role="img"
          aria-label={`QR code for ${joinUrl}`}
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <p className="mt-6 font-mono text-lg text-zinc-900">{shortUrl}</p>
        <p className="mt-10 text-sm text-zinc-500">Three Hellos · your answers are only shared with guests of this event</p>
      </section>
    </main>
  );
}
