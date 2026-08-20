import { AlertTriangle } from "lucide-react";
import type { SiteSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-brand-900 text-white",
  watch: "bg-gold-500 text-brand-900",
  warning: "bg-gold-600 text-white",
  red_alert: "bg-red-600 text-white animate-pulse",
};

export function EmergencyBanner({ settings }: { settings: SiteSettings }) {
  if (!settings.emergencyBannerActive || !settings.emergencyBannerMessage) return null;

  const style = LEVEL_STYLES[settings.emergencyBannerLevel ?? "info"] ?? LEVEL_STYLES.info;

  return (
    <div className={cn("px-4 py-3 text-center text-sm font-bold sm:text-base", style)} role="alert">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
        <AlertTriangle size={18} className="shrink-0" aria-hidden="true" />
        <span>{settings.emergencyBannerMessage}</span>
      </div>
    </div>
  );
}
