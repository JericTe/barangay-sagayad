import Image from "next/image";
import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { officials } from "@/lib/db/schema";
import { Card, Badge } from "@/components/ui/primitives";
import { OfficialForm } from "./OfficialForm";
import { DeleteOfficialButton } from "./DeleteOfficialButton";

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
              <div className="flex items-center gap-3">
                <Avatar name={o.name} photoUrl={o.photoUrl} />
                <div>
                  <p className="font-bold text-brand-900">{o.name}</p>
                  <p className="text-sm text-ink-soft">{o.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="brand">{o.category.replace(/_/g, " ")}</Badge>
                <DeleteOfficialButton id={o.id} name={o.name} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
