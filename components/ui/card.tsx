import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl bg-white p-6 ring-1 ring-zinc-200", className)} {...props} />;
}

/** Small rounded label, e.g. a badge number or a status. */
export function Pill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-zinc-900",
        className,
      )}
      {...props}
    />
  );
}
