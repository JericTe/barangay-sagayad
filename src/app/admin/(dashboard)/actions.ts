"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import {
  announcements,
  documentRequests,
  emergencyContacts,
  officials,
  reports,
  services,
} from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ActionState = { success?: boolean; error?: string };

export async function createAnnouncement(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Not signed in." };

  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString();
  const body = formData.get("body")?.toString().trim();
  const isPinned = formData.get("isPinned") === "on";
  const publishNow = formData.get("publishNow") === "on";

  if (!title || !category || !body) {
    return { error: "Title, category, and body are required." };
  }

  try {
    const db = getDb();
    await db.insert(announcements).values({
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      category: category as (typeof announcements.$inferInsert)["category"],
      body,
      isPinned,
      status: publishNow ? "published" : "draft",
      publishedAt: publishNow ? new Date() : null,
      authorId: session.userId,
    });
  } catch {
    return { error: "Couldn't save — the database isn't connected." };
  }

  revalidatePath("/announcements");
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { success: true };
}

export async function updateRequestStatus(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  const notes = formData.get("notes")?.toString();
  if (!id || !status) return { error: "Missing request id or status." };

  try {
    const db = getDb();
    await db
      .update(documentRequests)
      .set({
        status: status as (typeof documentRequests.$inferInsert)["status"],
        notes: notes || undefined,
        releasedAt: status === "released" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(documentRequests.id, id));
  } catch {
    return { error: "Couldn't update — the database isn't connected." };
  }

  revalidatePath("/admin/requests");
  return { success: true };
}

export async function updateReportStatus(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || !status) return { error: "Missing report id or status." };

  try {
    const db = getDb();
    await db
      .update(reports)
      .set({
        status: status as (typeof reports.$inferInsert)["status"],
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id));
  } catch {
    return { error: "Couldn't update — the database isn't connected." };
  }

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function createOfficial(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const position = formData.get("position")?.toString().trim();
  const category = formData.get("category")?.toString();

  if (!name || !position || !category) {
    return { error: "Name, position, and category are required." };
  }

  try {
    const db = getDb();
    await db.insert(officials).values({
      name,
      position,
      category: category as (typeof officials.$inferInsert)["category"],
      committee: formData.get("committee")?.toString() || undefined,
      contactEmail: formData.get("contactEmail")?.toString() || undefined,
      contactPhone: formData.get("contactPhone")?.toString() || undefined,
    });
  } catch {
    return { error: "Couldn't save — the database isn't connected." };
  }

  revalidatePath("/officials");
  revalidatePath("/admin/officials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteOfficial(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  if (!id) return { error: "Missing official id." };

  try {
    const db = getDb();
    await db.delete(officials).where(eq(officials.id, id));
  } catch {
    return { error: "Couldn't delete — the database isn't connected." };
  }

  revalidatePath("/officials");
  revalidatePath("/admin/officials");
  revalidatePath("/");
  return { success: true };
}

export async function createEmergencyContact(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const label = formData.get("label")?.toString().trim();
  if (!label) return { error: "Label is required." };

  try {
    const db = getDb();
    await db.insert(emergencyContacts).values({
      label,
      phone: formData.get("phone")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      notes: formData.get("notes")?.toString() || undefined,
    });
  } catch {
    return { error: "Couldn't save — the database isn't connected." };
  }

  revalidatePath("/emergency");
  revalidatePath("/admin/emergency-contacts");
  return { success: true };
}

function slugifyService(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createService(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString();

  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  try {
    const db = getDb();
    await db.insert(services).values({
      name,
      slug: `${slugifyService(name)}-${Date.now().toString(36)}`,
      category: category as (typeof services.$inferInsert)["category"],
      description: formData.get("description")?.toString() || undefined,
      feeInfo: formData.get("feeInfo")?.toString() || undefined,
      requirements: formData.get("requirements")?.toString() || undefined,
      processingTime: formData.get("processingTime")?.toString() || undefined,
      isRequestable: formData.get("isRequestable") === "on",
    });
  } catch {
    return { error: "Couldn't save — the database isn't connected." };
  }

  revalidatePath("/services");
  revalidatePath("/services/request");
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

export async function toggleServiceActive(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const isActive = formData.get("isActive") === "true";
  if (!id) return { error: "Missing service id." };

  try {
    const db = getDb();
    await db.update(services).set({ isActive: !isActive }).where(eq(services.id, id));
  } catch {
    return { error: "Couldn't update — the database isn't connected." };
  }

  revalidatePath("/services");
  revalidatePath("/services/request");
  revalidatePath("/admin/services");
  return { success: true };
}
