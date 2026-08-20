import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

function toTelHref(phone: string) {
  // Keep +, strip everything else so "tel:" links dial reliably.
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function PhoneLink({
  phone,
  label,
  className,
  big = false,
}: {
  phone: string;
  label?: string;
  className?: string;
  big?: boolean;
}) {
  return (
    <a
      href={toTelHref(phone)}
      className={cn(
        "inline-flex items-center gap-2 font-bold text-brand-700 underline-offset-2 hover:underline",
        big &&
          "min-h-12 rounded-xl bg-brand-900 px-4 py-3 text-white no-underline hover:bg-brand-700",
        className
      )}
    >
      <Phone size={big ? 18 : 14} aria-hidden="true" />
      {label ?? phone}
    </a>
  );
}
