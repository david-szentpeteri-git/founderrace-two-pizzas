import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getAdminView } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { siteUrl } from "@/lib/site";
import { formatEventDate } from "@/lib/utils";
import { PosterPrintButton } from "./PosterPrintButton";

// A4 poster for the door: guests scan the QR code and join on their phone.
// On screen it previews as a sheet; in print it fills one A4 page (sizes in pt/mm).

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
  const qrSvg = await QRCode.toString(joinUrl, { type: "svg", margin: 1, width: 600, errorCorrectionLevel: "M", color: { dark: "#18181b", light: "#ffffff" } });
  const when = formatEventDate(event.startsAt, event.timeZone);
  const shortUrl = joinUrl.replace(/^https?:\/\//, "");

  return (
    <main className="min-h-screen bg-zinc-100 px-4 pb-16 text-zinc-900 print:min-h-0 print:bg-white print:p-0">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print { html, body { background: #fff; } }
      `}</style>

      <div className="no-print mx-auto flex max-w-[210mm] items-center justify-between gap-4 py-6">
        <Link
          href={`/o/${adminToken}`}
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-zinc-600 sm:block">Prints on one A4 page</p>
          <PosterPrintButton />
        </div>
      </div>

      {/* The sheet: A4 proportions on screen, the whole page in print. */}
      <article className="mx-auto flex aspect-[210/297] w-full max-w-[210mm] flex-col bg-white px-[8%] py-[9%] shadow-[0_12px_40px_rgba(24,24,27,0.12)] print:aspect-auto print:h-[297mm] print:w-[210mm] print:max-w-none print:px-[18mm] print:py-[20mm] print:shadow-none">
        <h1 className="text-balance text-[clamp(1.75rem,6.4vw,3.6rem)] font-semibold leading-[1.05] tracking-tight print:text-[40pt]">
          Find the <span className="rounded-lg bg-lime-300 px-[0.18em]">three people</span> you should meet tonight
        </h1>
        <p className="mt-[4%] max-w-[34ch] text-[clamp(1rem,2.4vw,1.35rem)] leading-snug text-zinc-600 print:text-[16pt]">
          Scan, answer four quick questions, and get three names, why, and a first question to ask.
        </p>

        <div className="flex flex-1 items-center justify-center py-[5%]">
          <div
            className="aspect-square w-[72%] print:w-[122mm] [&>svg]:h-full [&>svg]:w-full"
            role="img"
            aria-label={`QR code that opens ${joinUrl}`}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>

        <div className="flex items-end justify-between gap-6 border-t border-zinc-200 pt-[4%]">
          <div className="min-w-0">
            <p className="truncate text-[clamp(0.95rem,2.2vw,1.25rem)] font-semibold print:text-[15pt]">{event.name}</p>
            {when || event.place ? (
              <p className="mt-1 text-[clamp(0.8rem,1.8vw,1rem)] text-zinc-600 print:text-[11pt]">
                {[when, event.place].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[clamp(0.75rem,1.6vw,0.95rem)] text-zinc-600 print:text-[10.5pt]">No camera? Type</p>
            <p className="text-[clamp(0.85rem,1.9vw,1.1rem)] font-semibold tracking-tight print:text-[13pt]">{shortUrl}</p>
          </div>
        </div>
      </article>
    </main>
  );
}
