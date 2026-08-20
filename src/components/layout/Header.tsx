"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, Megaphone, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextSizeToggle } from "./TextSizeToggle";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/announcements", label: "Announcements" },
  { href: "/officials", label: "Officials" },
  { href: "/puroks", label: "Puroks" },
  { href: "/contact", label: "Contact" },
];

export function Header({ barangayName }: { barangayName: string }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = React.useState(pathname);

  // Close the mobile menu on navigation. Adjusted during render (not an
  // effect) per React's guidance for resetting state in response to a prop
  // change — avoids an extra render pass from setState-inside-useEffect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-900 font-display text-lg font-bold text-white"
            aria-hidden="true"
          >
            BS
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-brand-900">
              {barangayName}
            </span>
            <span className="block text-xs text-ink-soft">San Fernando City, La Union</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-brand-100 hover:text-brand-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/report"
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Siren size={16} aria-hidden="true" />
            Report
          </Link>
          <Link
            href="/services/request"
            className="flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-gold-600"
          >
            <FileText size={16} aria-hidden="true" />
            Request
          </Link>
          <span className="ml-2">
            <TextSizeToggle />
          </span>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-line bg-paper lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-sm font-semibold text-ink-soft">Text size</span>
          <TextSizeToggle />
        </div>
        <nav className="grid grid-cols-2 gap-2 p-4" aria-label="Mobile primary">
          <MobileAction href="/services/request" label="Request" icon={<FileText size={20} />} tone="gold" />
          <MobileAction href="/report" label="Report" icon={<Siren size={20} />} tone="red" />
          <MobileAction href="/announcements" label="Announcements" icon={<Megaphone size={20} />} tone="brand" />
          <MobileAction href="/emergency" label="Emergency" icon={<Siren size={20} />} tone="red" />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-12 items-center rounded-xl border border-line bg-paper-raised px-4 text-base font-semibold text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function MobileAction({
  href,
  label,
  icon,
  tone,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  tone: "gold" | "red" | "brand";
}) {
  const tones = {
    gold: "bg-gold-500 text-brand-900",
    red: "bg-red-600 text-white",
    brand: "bg-brand-900 text-white",
  } as const;
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-14 items-center gap-2 rounded-xl px-4 text-base font-bold",
        tones[tone]
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
