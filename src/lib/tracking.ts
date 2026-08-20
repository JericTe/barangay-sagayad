import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { documentRequests, reports } from "@/lib/db/schema";

function randomDigits(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}

/** Format: SAG-2026-001284 */
export async function generateDocumentTrackingNumber(): Promise<string> {
  const db = getDb();
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = `SAG-${year}-${randomDigits(6)}`;
    const existing = await db
      .select({ id: documentRequests.id })
      .from(documentRequests)
      .where(eq(documentRequests.trackingNumber, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  throw new Error("Could not generate a unique tracking number. Please try again.");
}

/** Format: SGY-000421 */
export async function generateReportReferenceNumber(): Promise<string> {
  const db = getDb();
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = `SGY-${randomDigits(6)}`;
    const existing = await db
      .select({ id: reports.id })
      .from(reports)
      .where(eq(reports.referenceNumber, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  throw new Error("Could not generate a unique reference number. Please try again.");
}
