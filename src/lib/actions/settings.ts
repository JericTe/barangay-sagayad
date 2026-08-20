"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export type SettingsFormState = { success?: boolean; error?: string };

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (typeof v !== "string" || v.trim() === "") return null;
  return v.trim();
}

function int(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const db = getDb();

  const values = {
    barangayName: str(formData, "barangayName") ?? "Barangay Sagayad",
    tagline: str(formData, "tagline") ?? "Serbisyo, Impormasyon, at Pakikilahok Para sa Lahat.",
    address: str(formData, "address"),
    telephone: str(formData, "telephone"),
    mobile: str(formData, "mobile"),
    email: str(formData, "email"),
    officeHours: str(formData, "officeHours"),
    facebookUrl: str(formData, "facebookUrl"),
    captainFacebookUrl: str(formData, "captainFacebookUrl"),
    population: int(formData, "population"),
    populationYear: int(formData, "populationYear"),
    households: int(formData, "households"),
    emergencyBannerActive: formData.get("emergencyBannerActive") === "on",
    emergencyBannerLevel: str(formData, "emergencyBannerLevel") ?? "info",
    emergencyBannerMessage: str(formData, "emergencyBannerMessage"),
  };

  try {
    const existing = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing[0].id));
    } else {
      await db.insert(siteSettings).values(values);
    }
  } catch {
    return { error: "Couldn't save — the database isn't connected." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
