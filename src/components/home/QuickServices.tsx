import Link from "next/link";
import {
  FileText,
  Siren,
  Phone,
  Megaphone,
  MapPinned,
  HeartPulse,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";

const QUICK_SERVICES = [
  { href: "/services/request", label: "Request a Document", icon: FileText, tone: "gold" as const },
  { href: "/report", label: "Report an Issue", icon: Siren, tone: "red" as const },
  { href: "/announcements", label: "Announcements", icon: Megaphone, tone: "brand" as const },
  { href: "/contact", label: "Contact Barangay Hall", icon: Phone, tone: "brand" as const },
  { href: "/puroks", label: "View Puroks", icon: MapPinned, tone: "teal" as const },
  { href: "/health", label: "Health Services", icon: HeartPulse, tone: "teal" as const },
  { href: "/education", label: "Education & Child Development", icon: GraduationCap, tone: "brand" as const },
  { href: "/senior-citizens", label: "Senior Citizen Services", icon: Users, tone: "gold" as const },
  { href: "/youth", label: "Youth / SK Services", icon: Sparkles, tone: "teal" as const },
];

const TONE_STYLES = {
  gold: "bg-gold-100 text-gold-600 group-hover:bg-gold-500 group-hover:text-white",
  red: "bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white",
  brand: "bg-brand-100 text-brand-900 group-hover:bg-brand-900 group-hover:text-white",
  teal: "bg-teal-100 text-teal-600 group-hover:bg-teal-500 group-hover:text-white",
};

export function QuickServices() {
  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Quick Services"
        title="Everything you need, one tap away"
        description="The most common reasons residents visit the barangay hall — now available from your phone."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {QUICK_SERVICES.map(({ href, label, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-h-24 flex-col items-start justify-center gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-sm transition-colors hover:border-brand-500 sm:min-h-28 sm:p-5"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${TONE_STYLES[tone]}`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold leading-snug text-ink sm:text-base">{label}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
