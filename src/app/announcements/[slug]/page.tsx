import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { Container, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

async function getAnnouncement(slug: string) {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.slug, slug),
          eq(announcements.status, "published"),
          isNull(announcements.deletedAt)
        )
      )
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);
  if (!announcement) notFound();

  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <Badge tone={announcement.category === "emergency" ? "red" : "brand"}>
        {announcement.category.replace(/_/g, " ")}
      </Badge>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-brand-900">
        {announcement.title}
      </h1>
      {announcement.publishedAt ? (
        <p className="mt-2 text-sm text-ink-soft">
          Published{" "}
          {new Date(announcement.publishedAt).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : null}
      {announcement.location ? (
        <p className="text-sm text-ink-soft">Location: {announcement.location}</p>
      ) : null}

      <div className="prose prose-p:text-ink mt-6 whitespace-pre-line text-ink">
        {announcement.body}
      </div>

      <Button href="/announcements" variant="outline" className="mt-10">
        ← Back to all announcements
      </Button>
    </Container>
  );
}
