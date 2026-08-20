import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { ServiceForm } from "./ServiceForm";
import { ToggleServiceButton } from "./ToggleServiceButton";

async function listServices() {
  try {
    const db = getDb();
    return await db.select().from(services).orderBy(asc(services.sortOrder));
  } catch {
    return [];
  }
}

export default async function AdminServicesPage() {
  const items = await listServices();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Services</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Document types and services shown on the public Services page. Mark a document
        &ldquo;requestable online&rdquo; to make it selectable on the Request a Document form.
      </p>

      <Card className="mt-6">
        <p className="font-bold text-brand-900">Add a service</p>
        <div className="mt-4">
          <ServiceForm />
        </div>
      </Card>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No services yet — nothing will appear on the public Services page or the document
            request form until you add at least one here.
          </p>
        ) : (
          items.map((s) => (
            <Card key={s.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-brand-900">{s.name}</p>
                  <Badge tone="brand">{s.category}</Badge>
                  {s.isRequestable ? <Badge tone="teal">Requestable</Badge> : null}
                  {!s.isActive ? <Badge tone="neutral">Hidden</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  Fee: {s.feeInfo ?? "To be updated"} · Processing:{" "}
                  {s.processingTime ?? "To be updated"}
                </p>
              </div>
              <ToggleServiceButton id={s.id} isActive={s.isActive} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
