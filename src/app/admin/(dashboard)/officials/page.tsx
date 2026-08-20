import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { officials } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { OfficialForm } from "./OfficialForm";

async function listOfficials() {
  try {
    const db = getDb();
    return await db.select().from(officials).orderBy(asc(officials.sortOrder));
  } catch {
    return [];
  }
}

export default async function AdminOfficialsPage() {
  const items = await listOfficials();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-900">Officials</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Punong Barangay, Kagawad, SK, and support personnel shown on the public Officials page.
      </p>

      <Card className="mt-6">
        <p className="font-bold text-brand-900">Add an official</p>
        <div className="mt-4">
          <OfficialForm />
        </div>
      </Card>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft">No officials on record yet.</p>
        ) : (
          items.map((o) => (
            <Card key={o.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-900">{o.name}</p>
                <p className="text-sm text-ink-soft">{o.position}</p>
              </div>
              <Badge tone="brand">{o.category.replace(/_/g, " ")}</Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
