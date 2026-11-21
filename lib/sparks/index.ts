// Topic sparks: three conversation prompts built from this week's news on the
// event's theme, found with the Tavily search API (https://docs.tavily.com).
// Server only: reads TAVILY_API_KEY and is called from server components.
//
// Privacy: only the event name and description are sent to Tavily, to build the
// search query. Guest names, emails and answers never leave our server here.
//
// Failure is always quiet: with no key, an error, a timeout or too few results,
// getSparks returns [] and the guest page renders exactly as it does without sparks.

import { unstable_cache } from "next/cache";
import { buildQuery, pickSparks, type Spark } from "./core";

export type { Spark } from "./core";

type SparkEvent = { slug: string; name: string; description: string | null };

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
const TIMEOUT_MS = 4000;
const REVALIDATE_SECONDS = 6 * 60 * 60; // one search per event per 6 hours at most
const RETRY_AFTER_MS = 10 * 60 * 1000; // after a failed search, wait before trying again

class SearchFailed extends Error {}

/** One Tavily news search. Throws SearchFailed on network errors, timeouts and bad responses. */
async function searchNews(apiKey: string, query: string): Promise<Spark[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(TAVILY_SEARCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        topic: "news",
        time_range: "week",
        search_depth: "basic",
        max_results: 6,
        include_answer: false,
        include_images: false,
        include_raw_content: false,
      }),
      signal: controller.signal,
      cache: "no-store", // the result is cached below, per event
    });
    if (!res.ok) throw new SearchFailed(`Tavily responded ${res.status}`);
    const data = (await res.json()) as { results?: unknown };
    return pickSparks(data?.results);
  } catch (err) {
    throw err instanceof SearchFailed ? err : new SearchFailed(String(err));
  } finally {
    clearTimeout(timer);
  }
}

// Cached per event slug (and per name and description, since the arguments are
// part of the cache key). A successful search, even one with too few results, is
// kept for 6 hours. A failed search throws, so nothing is cached and the page
// shows no sparks; the cooldown below stops every guest from retrying at once.
const cachedSparks = unstable_cache(
  async (slug: string, name: string, description: string | null): Promise<Spark[]> => {
    const apiKey = process.env.TAVILY_API_KEY?.trim();
    if (!apiKey) return [];
    void slug; // part of the cache key only
    return searchNews(apiKey, buildQuery(name, description));
  },
  ["topic-sparks-v1"],
  { revalidate: REVALIDATE_SECONDS },
);

const failedAt = new Map<string, number>();

export async function getSparks(event: SparkEvent): Promise<Spark[]> {
  // No key: skip the cache entirely, so adding the key later works at once.
  if (!process.env.TAVILY_API_KEY?.trim()) return [];
  if (!event?.slug || !event.name?.trim()) return [];

  const last = failedAt.get(event.slug);
  if (last && Date.now() - last < RETRY_AFTER_MS) return [];

  try {
    const sparks = await cachedSparks(event.slug, event.name, event.description ?? null);
    failedAt.delete(event.slug);
    return Array.isArray(sparks) ? sparks : [];
  } catch (err) {
    // Logs the slug and the reason only: no key, no guest data.
    console.warn("[sparks] search failed for", event.slug, err instanceof Error ? err.message : String(err));
    failedAt.set(event.slug, Date.now());
    return [];
  }
}
