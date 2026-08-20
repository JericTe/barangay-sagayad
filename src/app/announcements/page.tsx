import type { Metadata } from "next";
import Link from "next/link";
import { Pin } from "lucide-react";
import { Container, SectionHeading, Card, Badge } from "@/components/ui/primitives";
import { getPublishedAnnouncements } from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Announcements",
  description: "Official announcements and public notices from Barangay Sagayad.",
};

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

export default async function AnnouncementsPage() {
  const items = await getPublishedAnnouncements(100);

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Stay Informed"
        title="Announcements"
        description="Official notices from Barangay Sagayad, most recent first. Pinned items stay at the top."
      />

      {items.length === 0 ? (
        <Card className="mt-8 border-dashed text-ink-soft">
          No announcements have been published yet.
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((a) => (
            <Link key={a.id} href={`/announcements/${a.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  {a.isPinned ? (
                    <Pin size={14} className="text-gold-600" aria-hidden="true" />
                  ) : null}
                  <Badge tone={a.category === "emergency" ? "red" : "brand"}>
                    {CATEGORY_LABELS[a.category] ?? a.category}
                  </Badge>
                  {a.publishedAt ? (
                    <span className="text-xs text-ink-soft">
                      {new Date(a.publishedAt).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 font-bold text-brand-900">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{a.body}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
