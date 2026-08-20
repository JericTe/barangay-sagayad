import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { ReportStatusForm } from "./ReportStatusForm";

const STATUS_TONE: Record<string, "gold" | "brand" | "teal" | "red" | "neutral"> = {
  received: "gold",
  under_review: "brand",
  assigned: "brand",
  in_progress: "gold",
  resolved: "teal",
  closed: "neutral",
};

async function listReports() {
  try {
    const db = getDb();
    return await db.select().from(reports).orderBy(desc(reports.createdAt)).limit(100);
  } catch {
    return [];
  }
}

export default async function AdminReportsPage() {
  const items = await listReports();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft">Resident-submitted issues, newest first.</p>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No reports submitted yet.</p>
        ) : (
          items.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-brand-900">{r.referenceNumber}</p>
                  <p className="text-sm text-ink-soft">
                    {r.category} {r.location ? `· ${r.location}` : ""}
                  </p>
                  {!r.isAnonymous && (r.contactName || r.contactPhone) ? (
                    <p className="text-xs text-ink-soft">
                      {r.contactName} {r.contactPhone ? `· ${r.contactPhone}` : ""}
                    </p>
                  ) : (
                    <p className="text-xs italic text-ink-soft">Anonymous</p>
                  )}
                </div>
                <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{r.status.replace(/_/g, " ")}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink">{r.description}</p>
              <div className="mt-3">
                <ReportStatusForm id={r.id} currentStatus={r.status} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
