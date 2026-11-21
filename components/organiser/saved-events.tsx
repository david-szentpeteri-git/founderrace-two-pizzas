"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

// Remembers the organiser's events in this browser, so a lost dashboard link
// is not a lost event. Only the event name and the private dashboard token are
// stored, and only on this device (localStorage); nothing is sent anywhere.

type SavedEvent = { token: string; name: string; seenAt: string };
const KEY = "threehellos:events";
const CHANGE = "threehellos:events-changed";

function read(): SavedEvent[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((e) => e && typeof e.token === "string" && typeof e.name === "string") : [];
  } catch {
    return [];
  }
}

let cache: { raw: string | null; list: SavedEvent[] } = { raw: null, list: [] };
function snapshot(): SavedEvent[] {
  const raw = localStorage.getItem(KEY);
  if (raw !== cache.raw) cache = { raw, list: read() };
  return cache.list;
}
const empty: SavedEvent[] = [];

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

/** Put on the organiser dashboard: records this event in the browser's list. */
export function RememberEvent({ token, name }: { token: string; name: string }) {
  useEffect(() => {
    try {
      const others = read().filter((e) => e.token !== token);
      const next = [{ token, name, seenAt: new Date().toISOString() }, ...others].slice(0, 20);
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE));
    } catch {
      // Private mode or storage full: the dashboard still works without it.
    }
  }, [token, name]);
  return null;
}

/** Lists the events this browser has created or opened. Renders nothing when there are none. */
export function SavedEvents() {
  const events = useSyncExternalStore(subscribe, snapshot, () => empty);
  if (events.length === 0) return null;

  function forget(token: string) {
    try {
      localStorage.setItem(KEY, JSON.stringify(read().filter((e) => e.token !== token)));
      window.dispatchEvent(new Event(CHANGE));
    } catch {}
  }

  return (
    <section aria-labelledby="saved-events" className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
      <h2 id="saved-events" className="text-lg font-semibold">
        Your events on this device
      </h2>
      <p className="mt-1 text-sm text-zinc-500">Open a dashboard you created or visited before in this browser.</p>
      <ul className="mt-4 divide-y divide-zinc-200">
        {events.map((e) => (
          <li key={e.token} className="flex items-center justify-between gap-3 py-2.5">
            <Link
              href={`/o/${e.token}`}
              className="min-w-0 truncate font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              {e.name}
            </Link>
            <button
              type="button"
              onClick={() => forget(e.token)}
              className="shrink-0 rounded text-sm text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Forget
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
