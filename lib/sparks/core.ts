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
const MAX_QUERY_WORDS = 5;
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
  const keywords = (text: string): string[] => {
    const words: string[] = [];
    const seen = new Set<string>();
    for (const raw of text.split(/\s+/)) {
      const word = raw.replace(/^[.'-]+|[.'-]+$/g, "");
      const key = word.toLowerCase();
      if (!word || FILLER.has(key) || seen.has(key)) continue;
      if (word.length < 2 && !/\d/.test(word)) continue;
      seen.add(key);
      words.push(word);
      if (words.length >= MAX_QUERY_WORDS) break;
    }
    return words;
  };
  // The description says what the event is about; the name is often a label
  // ("Winter social", "Meetup #14") that only adds noise to a news search.
  const fromDescription = keywords(clean(description ?? ""));
  const words =
    fromDescription.length >= 3 ? fromDescription : keywords([clean(name), clean(description ?? "")].join(" "));
  let query = words.join(" ");
  if (!query) query = clean(name).replace(/\s+/g, " ").trim();
  // A short query with "news" returns stories; a long keyword list returns listicles.
  return `${query.slice(0, MAX_QUERY_CHARS).trim()} news`;
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
/** Social feeds, shops and video sites are not news a guest can talk about. */
const BLOCKED_SOURCES = [
  "facebook.com", "instagram.com", "youtube.com", "youtu.be", "x.com", "twitter.com",
  "tiktok.com", "reddit.com", "pinterest.com", "linkedin.com", "ebay.com", "amazon.com",
];
const MIN_SCORE = 0.4;
const JUNK_TITLE = /\bfor sale\b|contact us|^events\b|^schedule\b|\bhiring\b|\bjobs\b|\bcoupon\b|\bprice\b|\bbuy now\b/i;

function isBlockedSource(source: string): boolean {
  return BLOCKED_SOURCES.some((d) => source === d || source.endsWith(`.${d}`));
}

/** First words of a headline, used to spot the same story from two outlets. */
function storyKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 5)
    .join(" ");
}

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
  const stories = new Set<string>();
  for (const { r } of ranked) {
    // A weak match is worse than no spark: guests should only see stories on the event's theme.
    if (typeof r.score === "number" && r.score < MIN_SCORE) continue;
    const url = safeHttpsUrl(r.url);
    const title = cleanHeadline(r.title);
    if (!url || title.length < 25 || title.split(/\s+/).length < 4 || JUNK_TITLE.test(title)) continue;
    const source = sourceOf(url);
    if (isBlockedSource(source)) continue;
    const key = storyKey(title);
    if (sources.has(source) || stories.has(key)) continue;
    sources.add(source);
    stories.add(key);
    sparks.push({ title, source, url: url.toString(), prompt: promptFor(title, sparks.length) });
    if (sparks.length >= MAX_SPARKS) break;
  }
  return sparks.length >= MIN_SPARKS ? sparks : [];
}
