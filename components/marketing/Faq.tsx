import { faq, type FaqItem } from "@/content/landing";

const items: FaqItem[] = faq.items;

// Features listed here are live, so their full FAQ answer shows.
// Anything else with dependsOn shows answerUntilLive instead.
const liveFeatures = new Set<string>([]);

export default function Faq() {
  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-200">
      {items.map((item) => {
        const answer =
          item.dependsOn && !liveFeatures.has(item.dependsOn) && item.answerUntilLive
            ? item.answerUntilLive
            : item.answer;
        return (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-zinc-900">
              <span>{item.question}</span>
              <span aria-hidden className="shrink-0 text-zinc-500 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{answer}</p>
          </details>
        );
      })}
    </div>
  );
}
