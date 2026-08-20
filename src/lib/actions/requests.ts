"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { documentRequests, services } from "@/lib/db/schema";
import { generateDocumentTrackingNumber } from "@/lib/tracking";

const RequestSchema = z.object({
  serviceId: z.string().min(1, "Please choose a document type."),
  requesterName: z.string().min(2, "Please enter your full name."),
  requesterContact: z.string().min(7, "Please enter a valid phone number or email."),
  purpose: z.string().optional(),
});

export type RequestFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitDocumentRequest(
  _prevState: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  const parsed = RequestSchema.safeParse({
    serviceId: formData.get("serviceId"),
    requesterName: formData.get("requesterName"),
    requesterContact: formData.get("requesterContact"),
    purpose: formData.get("purpose") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const db = getDb();

  const service = await db
    .select()
    .from(services)
    .where(eq(services.id, parsed.data.serviceId))
    .limit(1);

  if (service.length === 0 || !service[0].isRequestable) {
    return { error: "That document type isn't available for online request yet." };
  }

  const trackingNumber = await generateDocumentTrackingNumber();

  await db.insert(documentRequests).values({
    trackingNumber,
    serviceId: parsed.data.serviceId,
    requesterName: parsed.data.requesterName,
    requesterContact: parsed.data.requesterContact,
    purpose: parsed.data.purpose,
    status: "submitted",
  });

  redirect(`/services/track?tracking=${trackingNumber}&justSubmitted=1`);
}
