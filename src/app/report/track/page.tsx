import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { CheckCircle2, Circle } from "lucide-react";
import { getDb } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Track a Report",
  description: "Check the status of a problem you reported to Barangay Sagayad.",
};

const STEPS = [
  { key: "received", label: "Received" },
  { key: "under_review", label: "Under Review" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
] as const;

async function lookup(referenceNumber: string) {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(reports)
      .where(eq(reports.referenceNumber, referenceNumber.trim().toUpperCase()))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function TrackReportPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; justSubmitted?: string }>;
}) {
  const { ref, justSubmitted } = await searchParams;
  const result = ref ? await lookup(ref) : null;
  const currentStepIndex = result
    ? STEPS.findIndex((s) => s.key === result.status) === -1
      ? STEPS.length - 1 // closed maps past the end, show fully done
      : STEPS.findIndex((s) => s.key === result.status)
    : -1;

  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <SectionHeading
        eyebrow="Check Status"
        title="Track a Report"
        description="Enter the reference number you received when you submitted your report."
      />

      {justSubmitted && ref ? (
        <Card className="mt-6 border-teal-500/40 bg-teal-100/60">
          <p className="font-bold text-teal-700">Report submitted — thank you.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Your reference number is <span className="font-mono font-bold">{ref}</span>.
          </p>
        </Card>
      ) : null}

      <form method="GET" className="mt-8 flex gap-2">
        <input
          name="ref"
          defaultValue={ref ?? ""}
          placeholder="SGY-000000"
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

      {ref && !result ? (
        <Card className="mt-8 border-dashed">
          <p className="text-ink-soft">
            No report found for <span className="font-mono">{ref}</span>.
          </p>
        </Card>
      ) : null}

      {result ? (
        <Card className="mt-8">
          <p className="text-sm text-ink-soft">Category</p>
          <p className="font-bold text-brand-900">{result.category}</p>

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
          {result.status === "closed" ? (
            <p className="mt-4 text-sm text-ink-soft">This report has been closed.</p>
          ) : null}
        </Card>
      ) : null}
    </Container>
  );
}
