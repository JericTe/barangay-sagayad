import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { AnnouncementForm } from "./AnnouncementForm";

async function listAnnouncements() {
  try {
    const db = getDb();
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(50);
  } catch {
    return [];
  }
}

export default async function AdminAnnouncementsPage() {
  const items = await listAnnouncements();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Announcements</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Published announcements appear immediately on the public site.
      </p>

      <Card className="mt-6">
        <p className="font-bold text-brand-900">New announcement</p>
        <div className="mt-4">
          <AnnouncementForm />
        </div>
      </Card>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No announcements yet.</p>
        ) : (
          items.map((a) => (
            <Card key={a.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone={a.status === "published" ? "teal" : "neutral"}>{a.status}</Badge>
                  <Badge tone="brand">{a.category.replace(/_/g, " ")}</Badge>
                  {a.isPinned ? <Badge tone="gold">Pinned</Badge> : null}
                </div>
                <p className="mt-2 font-bold text-brand-900">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{a.body}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
