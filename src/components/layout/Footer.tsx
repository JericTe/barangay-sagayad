import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import type { SiteSettings } from "@/lib/data";
import { ToBeUpdated } from "@/components/ui/primitives";
import { PhoneLink } from "@/components/ui/PhoneLink";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-line bg-brand-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">{settings.barangayName}</p>
          <p className="mt-2 max-w-xs text-sm text-white/80">{settings.tagline}</p>
          <p className="mt-4 text-sm text-white/70">
            {settings.municipality}, {settings.province}, {settings.region}, Philippines
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-500">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {settings.address ?? <ToBeUpdated />}
            </li>
            <li className="flex items-start gap-2">
              {settings.telephone ?? settings.mobile ? (
                <PhoneLink
                  phone={(settings.telephone ?? settings.mobile) as string}
                  className="!text-white/85 hover:!text-gold-500"
                />
              ) : (
                <ToBeUpdated />
              )}
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {settings.email ?? <ToBeUpdated />}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-500">
            Follow Barangay Sagayad
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {settings.facebookUrl ? (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/90 hover:text-gold-500"
              >
                <FacebookIcon size={16} /> Official Barangay Facebook
              </a>
            ) : null}
            {settings.captainFacebookUrl ? (
              <a
                href={settings.captainFacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/90 hover:text-gold-500"
              >
                <FacebookIcon size={16} /> Punong Barangay Facebook
              </a>
            ) : null}
            <Link href="/admin/login" className="mt-4 text-white/50 hover:text-white/80">
              Staff &amp; admin sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {settings.barangayName}. Built as a public service platform.
      </div>
    </footer>
  );
}
