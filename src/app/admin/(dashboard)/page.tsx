import { count, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { announcements, documentRequests, officials, puroks, reports } from "@/lib/db/schema";
import { Card } from "@/components/ui/primitives";

async function safeCount(fn: () => Promise<{ value: number }[]>) {
  try {
    const rows = await fn();
    return rows[0]?.value ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminOverviewPage() {
  const [pendingRequests, openReports, officialsCount, publishedAnnouncements, purokCount] =
    await Promise.all([
      safeCount(() =>
        getDb()
          .select({ value: count() })
          .from(documentRequests)
          .where(eq(documentRequests.status, "submitted"))
      ),
      safeCount(() =>
        getDb().select({ value: count() }).from(reports).where(eq(reports.status, "received"))
      ),
      safeCount(() => getDb().select({ value: count() }).from(officials)),
      safeCount(() =>
        getDb()
          .select({ value: count() })
          .from(announcements)
          .where(eq(announcements.status, "published"))
      ),
      safeCount(() => getDb().select({ value: count() }).from(puroks)),
    ]);

  const stats = [
    { label: "Pending Document Requests", value: pendingRequests },
    { label: "Open Reports", value: openReports },
    { label: "Officials on Record", value: officialsCount },
    { label: "Published Announcements", value: publishedAnnouncements },
    { label: "Puroks Configured", value: purokCount },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink-soft">
        A snapshot of what needs attention across Barangay Sagayad&apos;s platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="font-display text-3xl font-extrabold text-brand-900">
              {s.value === null ? "—" : s.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            {s.value === null ? (
              <p className="mt-1 text-xs text-red-700">Database not connected</p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
