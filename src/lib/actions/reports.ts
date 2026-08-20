"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { generateReportReferenceNumber } from "@/lib/tracking";

const ReportSchema = z.object({
  category: z.string().min(1, "Please choose a category."),
  description: z.string().min(10, "Please describe the issue in a bit more detail."),
  location: z.string().optional(),
  isAnonymous: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
});

export type ReportFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitReport(
  _prevState: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const parsed = ReportSchema.safeParse({
    category: formData.get("category"),
    description: formData.get("description"),
    location: formData.get("location") ?? undefined,
    isAnonymous: formData.get("isAnonymous")?.toString(),
    contactName: formData.get("contactName") ?? undefined,
    contactPhone: formData.get("contactPhone") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const isAnonymous = parsed.data.isAnonymous === "on";

  const db = getDb();
  const referenceNumber = await generateReportReferenceNumber();

  await db.insert(reports).values({
    referenceNumber,
    category: parsed.data.category,
    description: parsed.data.description,
    location: parsed.data.location,
    isAnonymous,
    contactName: isAnonymous ? null : parsed.data.contactName,
    contactPhone: isAnonymous ? null : parsed.data.contactPhone,
    status: "received",
  });

  redirect(`/report/track?ref=${referenceNumber}&justSubmitted=1`);
}
