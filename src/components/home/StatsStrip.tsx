import { Container } from "@/components/ui/primitives";
import type { SiteSettings } from "@/lib/data";

export function StatsStrip({
  settings,
  purokCount,
}: {
  settings: SiteSettings;
  purokCount: number;
}) {
  const stats = [
    {
      label: `Population (${settings.populationYear ?? "—"})`,
      value: settings.population?.toLocaleString() ?? "To be updated",
    },
    {
      label: "Households",
      value: settings.households?.toLocaleString() ?? "To be updated",
    },
    {
      label: "Puroks",
      value: purokCount > 0 ? purokCount.toString() : "To be updated",
    },
  ];

  return (
    <div className="border-y border-line bg-paper-raised">
      <Container className="grid grid-cols-3 divide-x divide-line py-8 text-center">
        {stats.map((s) => (
          <div key={s.label} className="px-2">
            <p className="font-display text-2xl font-extrabold text-brand-900 sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </Container>
    </div>
  );
}
