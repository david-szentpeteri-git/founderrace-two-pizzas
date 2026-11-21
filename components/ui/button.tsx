import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Same look as the landing page buttons (Daniel's app/page.tsx).
type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700",
  secondary: "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900",
  ghost: "text-zinc-900 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

type StyleProps = { variant?: Variant; size?: Size };

export function buttonClass({ variant = "primary", size = "md" }: StyleProps = {}, extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & StyleProps) {
  return <button className={buttonClass({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />;
}
