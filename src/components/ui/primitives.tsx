import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-paper-raised p-5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

const badgeTones = {
  brand: "bg-brand-100 text-brand-900",
  gold: "bg-gold-100 text-gold-600",
  teal: "bg-teal-100 text-teal-600",
  red: "bg-red-100 text-red-700",
  neutral: "bg-line/60 text-ink-soft",
} as const;

export function Badge({
  tone = "brand",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof badgeTones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}

/**
 * The page's one recurring signature mark: a thin coastline wave beneath
 * section headings. Used sparingly — one per section, never as background
 * decoration — so it stays a signature instead of wallpaper.
 */
export function WaveDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className={cn("h-3 w-16 text-gold-500", className)}
      aria-hidden="true"
    >
      <path
        d="M0 6 C 20 0, 30 12, 50 6 S 80 0, 100 6 S 130 12, 150 6 S 180 0, 200 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl font-bold text-brand-900 sm:text-3xl">{title}</h2>
      <WaveDivider className="mt-3" />
      {description ? <p className="mt-3 text-ink-soft">{description}</p> : null}
    </div>
  );
}

export function ToBeUpdated({ label = "To be updated" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-line/50 px-2 py-1 text-sm italic text-ink-soft">
      {label}
    </span>
  );
}
