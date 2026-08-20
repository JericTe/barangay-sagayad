import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading, Card, Badge, ToBeUpdated } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { getActiveServices } from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Services",
  description: "Barangay Sagayad document and service catalogue — fees, requirements, and how to request.",
};

const CATEGORY_LABELS: Record<string, string> = {
  document: "Documents & Certificates",
  report: "Reports",
  health: "Health",
  education: "Education",
  senior: "Senior Citizens",
  youth: "Youth",
  general: "General",
};

export default async function ServicesPage() {
  const services = await getActiveServices();
  const byCategory = services.reduce<Record<string, typeof services>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Barangay Services"
        title="Document & Service Catalogue"
        description="Fees, requirements, and processing times are set by barangay staff and kept current here."
      />

      {services.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <ToBeUpdated label="Service catalogue is being set up by barangay staff." />
        </Card>
      ) : (
        Object.entries(byCategory).map(([category, items]) => (
          <div key={category} className="mt-10">
            <h3 className="font-display text-lg font-bold text-brand-900">
              {CATEGORY_LABELS[category] ?? category}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {items.map((s) => (
                <Card key={s.id}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-brand-900">{s.name}</p>
                    {s.isRequestable ? <Badge tone="teal">Request online</Badge> : null}
                  </div>
                  {s.description ? (
                    <p className="mt-1 text-sm text-ink-soft">{s.description}</p>
                  ) : null}
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-medium text-ink-soft">Fee:</dt>
                      <dd>{s.feeInfo ?? <ToBeUpdated />}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-medium text-ink-soft">Processing:</dt>
                      <dd>{s.processingTime ?? <ToBeUpdated />}</dd>
                    </div>
                  </dl>
                  {s.isRequestable ? (
                    <Button href={`/services/request?service=${s.slug}`} size="sm" className="mt-4">
                      Request this document
                    </Button>
                  ) : null}
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      <Card className="mt-12 bg-brand-100/60">
        <p className="font-bold text-brand-900">Need something not listed here?</p>
        <p className="mt-1 text-sm text-ink-soft">
          Reach out directly and barangay staff will help you in person or over the phone.
        </p>
        <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">
          Contact Barangay Sagayad →
        </Link>
      </Card>
    </Container>
  );
}
