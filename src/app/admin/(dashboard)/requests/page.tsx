import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { documentRequests, services } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { RequestStatusForm } from "./RequestStatusForm";

const STATUS_TONE: Record<string, "gold" | "brand" | "teal" | "neutral"> = {
  submitted: "gold",
  under_review: "brand",
  approved: "teal",
  ready_for_pickup: "teal",
  released: "neutral",
};

async function listRequests() {
  try {
    const db = getDb();
    return await db
      .select({
        id: documentRequests.id,
        trackingNumber: documentRequests.trackingNumber,
        requesterName: documentRequests.requesterName,
        requesterContact: documentRequests.requesterContact,
        status: documentRequests.status,
        notes: documentRequests.notes,
        submittedAt: documentRequests.submittedAt,
        serviceName: services.name,
      })
      .from(documentRequests)
      .leftJoin(services, eq(documentRequests.serviceId, services.id))
      .orderBy(desc(documentRequests.submittedAt))
      .limit(100);
  } catch {
    return [];
  }
}

export default async function AdminRequestsPage() {
  const items = await listRequests();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Document Requests</h1>
      <p className="mt-1 text-sm text-ink-soft">Review, update status, and add notes.</p>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No requests submitted yet.</p>
        ) : (
          items.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-brand-900">{r.trackingNumber}</p>
                  <p className="text-sm text-ink-soft">
                    {r.serviceName ?? "—"} · {r.requesterName} · {r.requesterContact}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{r.status.replace(/_/g, " ")}</Badge>
              </div>
              <div className="mt-3">
                <RequestStatusForm id={r.id} currentStatus={r.status} currentNotes={r.notes ?? ""} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
