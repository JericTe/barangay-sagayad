import { FileText, Megaphone, Siren } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/data";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* Signature coastline mark — the one bold gesture on the page, kept out of the way of the text. */}
      <svg
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-white/5"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="currentColor" />
      </svg>

      <Container className="relative py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">
          {settings.municipality}, {settings.province}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Welcome to {settings.barangayName}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85">{settings.tagline}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col">
            <Button href="/services/request" variant="gold" size="lg" className="justify-center">
              <FileText size={20} aria-hidden="true" />
              Request a Document
            </Button>
            <span className="mt-1 text-center text-xs text-white/60 sm:text-left">
              Humiling ng Dokumento
            </span>
          </div>
          <div className="flex flex-col">
            <Button
              href="/report"
              size="lg"
              className="justify-center border-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Siren size={20} aria-hidden="true" />
              Report a Problem
            </Button>
            <span className="mt-1 text-center text-xs text-white/60 sm:text-left">
              Mag-ulat ng Problema
            </span>
          </div>
          <div className="flex flex-col">
            <Button
              href="/announcements"
              size="lg"
              className="justify-center border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Megaphone size={20} aria-hidden="true" />
              See Announcements
            </Button>
            <span className="mt-1 text-center text-xs text-white/60 sm:text-left">
              Mga Anunsyo
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
