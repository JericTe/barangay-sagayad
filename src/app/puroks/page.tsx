import type { Metadata } from "next";
import { Users, Home } from "lucide-react";
import { Container, SectionHeading, Card, ToBeUpdated } from "@/components/ui/primitives";
import { getActivePuroks } from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Know Your Purok",
  description: "Puroks of Barangay Sagayad — leaders, population, facilities, and local information.",
};

export default async function PuroksPage() {
  const puroksList = await getActivePuroks();

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Know Your Purok"
        title="Puroks of Barangay Sagayad"
        description="Every purok is managed directly by barangay staff — nothing here is guessed or invented."
      />

      {puroksList.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <ToBeUpdated label="The list of puroks hasn't been entered yet. Barangay staff can add each purok from the admin dashboard." />
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {puroksList.map((p) => (
            <Card key={p.id}>
              <p className="font-display text-lg font-bold text-brand-900">
                Purok {p.number} {p.name ? `— ${p.name}` : ""}
              </p>
              {p.description ? (
                <p className="mt-1 text-sm text-ink-soft">{p.description}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                {p.leaderName ? (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} aria-hidden="true" /> {p.leaderName}
                  </span>
                ) : null}
                {p.households ? (
                  <span className="flex items-center gap-1.5">
                    <Home size={14} aria-hidden="true" /> {p.households} households
                  </span>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
