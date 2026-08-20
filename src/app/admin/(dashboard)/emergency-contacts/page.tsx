import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { emergencyContacts } from "@/lib/db/schema";
import { Card } from "@/components/ui/primitives";
import { EmergencyContactForm } from "./EmergencyContactForm";

async function listContacts() {
  try {
    const db = getDb();
    return await db.select().from(emergencyContacts).orderBy(asc(emergencyContacts.sortOrder));
  } catch {
    return [];
  }
}

export default async function AdminEmergencyContactsPage() {
  const items = await listContacts();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Emergency Contacts</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Shown on the public Emergency Center page. Only add numbers you&apos;ve personally verified —
        an incorrect emergency number is worse than a blank one.
      </p>

      <Card className="mt-6">
        <p className="font-bold text-brand-900">Add a contact</p>
        <div className="mt-4">
          <EmergencyContactForm />
        </div>
      </Card>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No emergency contacts on record yet.</p>
        ) : (
          items.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-900">{c.label}</p>
                <p className="text-sm text-ink-soft">
                  {c.phone ?? "—"} {c.email ? `· ${c.email}` : ""}
                </p>
                {c.notes ? <p className="text-xs text-ink-soft">{c.notes}</p> : null}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
