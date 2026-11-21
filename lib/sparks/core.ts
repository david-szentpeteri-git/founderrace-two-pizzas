// Pure helpers for topic sparks: query building, result filtering and the
// question templates. No Next.js or network code here, so this file can be
// tested on its own with `node --experimental-strip-types`.

export type Spark = {
  title: string; // the headline, cleaned and trimmed
  source: string; // domain, e.g. "theverge.com"
  url: string; // https only
  prompt: string; // a question one guest can ask another
};

/** One item of `results` in a Tavily search response (only the fields we read). */
export type TavilyResult = {
  title?: unknown;
  url?: unknown;
  content?: unknown;
  score?: unknown;
  published_date?: unknown;
};

export const MAX_SPARKS = 3;
export const MIN_SPARKS = 2;
const MAX_QUERY_WORDS = 10;
const MAX_QUERY_CHARS = 200;
const MAX_HEADLINE_CHARS = 90;

// Common English words plus words that describe the format of an event rather
// than its theme ("mixer", "drinks"). Removing them keeps the news search on topic.
const FILLER = new Set(
  (
    "a an and are as at be been but by can come do does done for from get got has have here how i if in into is it its " +
    "just let lets more most no not of on or our out over so some something than that the their them then there these " +
    "they this those to too up us very via was we were what when where which who whom why will with without you your " +
    "about all also any each every just like many much new only other own same such thinking starting want wants " +
    "event events sample evening night morning afternoon day weekend mixer meetup meet social socials drinks drink " +
    "snacks snack food pizza pizzas speeches speech talk talks welcome join hosted host hosts edition session sessions " +
    "monthly weekly annual informal casual party gathering get-together edition club"
  ).split(/\s+/),
);

/**
 * Builds the search query from the event name and description only.
 * Privacy: guest names and answers never go into this query.
 */
export function buildQuery(name: string, description: string | null | undefined): string {
  const clean = (s: string) =>
    s
      .replace(/\([^)]*\)/g, " ") // drop asides like "(sample event)"
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[^\p{L}\p{N}+#&.' -]+/gu, " ");
  const words: string[] = [];
  const seen = new Set<string>();
  const source = [clean(name), clean(description ?? "")].join(" ");
  for (const raw of source.split(/\s+/)) {
    const word = raw.replace(/^[.'-]+|[.'-]+$/g, "");
    const key = word.toLowerCase();
    if (!word || FILLER.has(key) || seen.has(key)) continue;
    if (word.length < 2 && !/\d/.test(word)) continue;
    seen.add(key);
    words.push(word);
    if (words.length >= MAX_QUERY_WORDS) break;
  }
  let query = words.join(" ");
  if (!query) query = clean(name).replace(/\s+/g, " ").trim();
  return query.slice(0, MAX_QUERY_CHARS).trim();
}

/** Domain shown under a spark: hostname without "www.". */
export function sourceOf(url: URL): string {
  return url.hostname.replace(/^www\./i, "").toLowerCase();
}

/** Parses a URL and keeps it only when it is https. */
export function safeHttpsUrl(value: unknown): URL | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !url.hostname.includes(".")) return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * Cleans a headline for display: drops a trailing " | Site name" or " - Site name",
 * swaps long dashes for commas, removes double quotes (the prompt wraps the headline
 * in quotes), and trims long headlines at a word boundary.
 */
export function cleanHeadline(value: unknown): string {
  if (typeof value !== "string") return "";
  let h = value.replace(/\s+/g, " ").trim();
  // Trailing site name, short enough to be a brand and not part of the headline.
  const suffix = h.match(/^(.{20,}?)\s+[|–—-]\s+([^|–—-]{2,40})$/);
  // A brand starts with a capital or a digit ("Reuters", "The Verge", "9to5Mac");
  // a clause like " - and prices rise" does not, so it stays.
  if (suffix && /^[\p{Lu}\p{N}]/u.test(suffix[2].trim()) && suffix[2].trim().split(" ").length <= 4) {
    h = suffix[1].trim();
  }
  h = h
    .replace(/\s*[–—]\s*/g, ", ")
    .replace(/["“”]/g, "'")
    .replace(/\s+,/g, ",")
    .trim();
  if (h.length > MAX_HEADLINE_CHARS) {
    const cut = h.slice(0, MAX_HEADLINE_CHARS);
    const lastSpace = cut.lastIndexOf(" ");
    h = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:!?'-]+$/, "") + "…";
  }
  return h;
}

// Each template only quotes the headline and asks an open question. None of
// them states what the article says beyond its title.
const TEMPLATES: ((headline: string) => string)[] = [
  (h) => `Did you see "${h}"? What do you make of it?`,
  (h) => `I saw the headline "${h}". Is that a big deal, or just noise?`,
  (h) => `Have you read about "${h}"? I'm curious what you think.`,
];

export function promptFor(headline: string, index: number): string {
  return TEMPLATES[index % TEMPLATES.length](headline);
}

/**
 * Keeps the best results from distinct sources, skipping any without a title or
 * an https URL. Tavily returns results ranked by relevance; ties keep that order.
 * Returns an empty list when fewer than two usable results remain.
 */
export function pickSparks(results: unknown): Spark[] {
  if (!Array.isArray(results)) return [];
  const ranked = results
    .map((r, i) => ({ r: (r ?? {}) as TavilyResult, i }))
    .sort((a, b) => {
      const sa = typeof a.r.score === "number" ? a.r.score : 0;
      const sb = typeof b.r.score === "number" ? b.r.score : 0;
      return sb - sa || a.i - b.i;
    });

  const sparks: Spark[] = [];
  const sources = new Set<string>();
  const titles = new Set<string>();
  for (const { r } of ranked) {
    const url = safeHttpsUrl(r.url);
    const title = cleanHeadline(r.title);
    if (!url || title.length < 8) continue;
    const source = sourceOf(url);
    const titleKey = title.toLowerCase();
    if (sources.has(source) || titles.has(titleKey)) continue;
    sources.add(source);
    titles.add(titleKey);
    sparks.push({ title, source, url: url.toString(), prompt: promptFor(title, sparks.length) });
    if (sparks.length >= MAX_SPARKS) break;
  }
  return sparks.length >= MIN_SPARKS ? sparks : [];
}
