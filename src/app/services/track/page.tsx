import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { CheckCircle2, Circle } from "lucide-react";
import { getDb } from "@/lib/db";
import { documentRequests, services } from "@/lib/db/schema";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Track a Document Request",
  description: "Check the status of a Barangay Sagayad document request using your tracking number.",
};

const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "ready_for_pickup", label: "Ready for Pickup" },
  { key: "released", label: "Released" },
] as const;

async function lookup(trackingNumber: string) {
  try {
    const db = getDb();
    const rows = await db
      .select({
        trackingNumber: documentRequests.trackingNumber,
        status: documentRequests.status,
        notes: documentRequests.notes,
        submittedAt: documentRequests.submittedAt,
        serviceName: services.name,
      })
      .from(documentRequests)
      .leftJoin(services, eq(documentRequests.serviceId, services.id))
      .where(eq(documentRequests.trackingNumber, trackingNumber.trim().toUpperCase()))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function TrackRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ tracking?: string; justSubmitted?: string }>;
}) {
  const { tracking, justSubmitted } = await searchParams;
  const result = tracking ? await lookup(tracking) : null;
  const currentStepIndex = result ? STEPS.findIndex((s) => s.key === result.status) : -1;

  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <SectionHeading
        eyebrow="Check Status"
        title="Track a Document Request"
        description="Enter the tracking number you received when you submitted your request."
      />

      {justSubmitted && tracking ? (
        <Card className="mt-6 border-teal-500/40 bg-teal-100/60">
          <p className="font-bold text-teal-700">Request submitted!</p>
          <p className="mt-1 text-sm text-ink-soft">
            Your tracking number is <span className="font-mono font-bold">{tracking}</span>. Save
            it — you&apos;ll need it to check your status.
          </p>
        </Card>
      ) : null}

      <form method="GET" className="mt-8 flex gap-2">
        <input
          name="tracking"
          defaultValue={tracking ?? ""}
          placeholder="SAG-2026-000000"
          required
          className="flex-1 rounded-xl border border-line bg-paper-raised px-4 py-3 font-mono text-base uppercase"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-900 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Check
        </button>
      </form>

      {tracking && !result ? (
        <Card className="mt-8 border-dashed">
          <p className="text-ink-soft">
            No request found for <span className="font-mono">{tracking}</span>. Double-check the
            number, or contact the barangay hall if you believe this is an error.
          </p>
        </Card>
      ) : null}

      {result ? (
        <Card className="mt-8">
          <p className="text-sm text-ink-soft">Document</p>
          <p className="font-bold text-brand-900">{result.serviceName ?? "—"}</p>

          <ol className="mt-6 space-y-4">
            {STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              return (
                <li key={step.key} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="text-teal-600" size={22} aria-hidden="true" />
                  ) : (
                    <Circle className="text-line" size={22} aria-hidden="true" />
                  )}
                  <span className={cn("font-medium", done ? "text-ink" : "text-ink-soft")}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {result.notes ? (
            <p className="mt-6 rounded-xl bg-brand-100/60 p-3 text-sm text-ink-soft">
              Note from barangay staff: {result.notes}
            </p>
          ) : null}
        </Card>
      ) : null}
    </Container>
  );
}
