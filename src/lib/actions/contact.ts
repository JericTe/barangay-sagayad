"use server";

import { z } from "zod";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  contact: z.string().min(5, "Please enter a phone number or email."),
  subject: z.string().optional(),
  message: z.string().min(10, "Please write a bit more so staff know how to help."),
});

export type ContactFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    subject: formData.get("subject") ?? undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  try {
    const db = getDb();
    await db.insert(contactMessages).values(parsed.data);
    return { success: true };
  } catch {
    return { error: "The database isn't connected yet, so this message wasn't saved." };
  }
}
