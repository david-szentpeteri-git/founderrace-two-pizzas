"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { buttonClass } from "@/components/ui/button";

/** Small spinner for buttons that are waiting on the server. */
function Spinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 motion-safe:animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Copies `text` to the clipboard and says so for two seconds. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={buttonClass({ variant: "secondary" })}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link:", text);
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Re-renders the server page every `seconds` so new guests appear by themselves. */
export function AutoRefresh({ seconds = 10 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}

/** Small text button that asks for confirmation first. */
export function ConfirmSubmit({ children, confirmText }: { children: React.ReactNode; confirmText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="shrink-0 rounded text-sm font-medium text-zinc-500 underline-offset-4 hover:text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-50"
    >
      {pending ? "Removing…" : children}
    </button>
  );
}

/**
 * Submit button that shows a spinner and `pendingLabel` while its form's server
 * action runs. With `confirmText`, asks first (for actions that replace data).
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  size = "lg",
  disabled,
  confirmText,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  disabled?: boolean;
  confirmText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      onClick={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
      className={buttonClass({ variant, size })}
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
