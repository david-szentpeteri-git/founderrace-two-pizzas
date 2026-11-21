"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { buttonClass } from "@/components/ui/button";

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
      {copied ? "Copied" : label}
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

/** Small submit button that asks for confirmation first. */
export function ConfirmSubmit({ children, confirmText }: { children: React.ReactNode; confirmText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="shrink-0 text-sm font-medium text-zinc-500 underline-offset-4 hover:text-red-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Removing..." : children}
    </button>
  );
}

/** Submit button that shows `pendingLabel` while its form's server action runs. */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  size = "lg",
  disabled,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={buttonClass({ variant, size })}>
      {pending ? pendingLabel : children}
    </button>
  );
}
