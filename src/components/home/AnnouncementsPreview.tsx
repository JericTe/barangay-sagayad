import Link from "next/link";
import { Pin } from "lucide-react";
import { Container, SectionHeading, Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import type { announcements } from "@/lib/db/schema";

type Announcement = typeof announcements.$inferSelect;

const CATEGORY_LABELS: Record<string, string> = {
  emergency: "Emergency",
  government: "Barangay Government",
  health: "Health",
  education: "Education",
  senior: "Senior Citizens",
  youth: "Youth",
  public_works: "Public Works",
  peace_and_order: "Peace & Order",
  environment: "Environment",
  livelihood: "Livelihood",
  events: "Events",
};

export function AnnouncementsPreview({ items }: { items: Announcement[] }) {
  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Community Updates" title="Latest Announcements" />
        <Button href="/announcements" variant="outline" size="sm">
          View all
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="mt-8 border-dashed text-ink-soft">
          No announcements have been published yet. Once barangay staff post one from the admin
          dashboard, it will appear here automatically.
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link key={a.id} href={`/announcements/${a.slug}`} className="block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  {a.isPinned ? (
                    <Pin size={14} className="text-gold-600" aria-hidden="true" />
                  ) : null}
                  <Badge tone="brand">{CATEGORY_LABELS[a.category] ?? a.category}</Badge>
                </div>
                <p className="mt-3 font-bold text-brand-900">{a.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{a.body}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
