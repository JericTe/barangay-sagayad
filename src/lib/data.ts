import { and, asc, desc, eq, isNull, or, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  announcements,
  emergencyContacts,
  officials,
  puroks,
  services,
  siteSettings,
  pages,
} from "@/lib/db/schema";

/**
 * These helpers exist so that public pages render sensibly — with clear
 * "To be updated" placeholders — even before the database is connected or
 * seeded. Once DATABASE_URL is set and `npm run db:seed` has run, real data
 * takes over automatically; nothing else needs to change.
 */

export const DEFAULT_SITE_SETTINGS: Omit<
  typeof siteSettings.$inferSelect,
  "id" | "createdAt" | "updatedAt"
> = {
  barangayName: "Barangay Sagayad",
  tagline: "Serbisyo, Impormasyon, at Pakikilahok Para sa Lahat.",
  municipality: "City of San Fernando",
  province: "La Union",
  region: "Region I",
  address: null,
  telephone: null,
  mobile: null,
  email: "theo.dacanay@gmail.com",
  officeHours: null,
  facebookUrl: "https://www.facebook.com/LGUSAGAYAD",
  captainFacebookUrl: "https://www.facebook.com/KapTheoDacanay",
  population: 3164,
  populationYear: 2020,
  households: null,
  emergencyBannerActive: false,
  emergencyBannerLevel: "info",
  emergencyBannerMessage: null,
};

export type SiteSettings = typeof DEFAULT_SITE_SETTINGS;

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const rows = await db.select().from(siteSettings).limit(1);
    if (rows.length === 0) return DEFAULT_SITE_SETTINGS;
    const { id, createdAt, updatedAt, ...rest } = rows[0];
    void id;
    void createdAt;
    void updatedAt;
    return { ...DEFAULT_SITE_SETTINGS, ...rest };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getActiveOfficials() {
  try {
    const db = getDb();
    return await db
      .select()
      .from(officials)
      .where(and(eq(officials.isActive, true), isNull(officials.deletedAt)))
      .orderBy(asc(officials.sortOrder));
  } catch {
    return [];
  }
}

export async function getPublishedAnnouncements(limit = 20) {
  try {
    const db = getDb();
    const now = new Date();
    return await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.status, "published"),
          isNull(announcements.deletedAt),
          or(isNull(announcements.expiresAt), gte(announcements.expiresAt, now))
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.publishedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getActiveServices() {
  try {
    const db = getDb();
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder));
  } catch {
    return [];
  }
}

export async function getActivePuroks() {
  try {
    const db = getDb();
    return await db
      .select()
      .from(puroks)
      .where(and(eq(puroks.isActive, true), isNull(puroks.deletedAt)))
      .orderBy(asc(puroks.number));
  } catch {
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const db = getDb();
    const rows = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getActiveEmergencyContacts() {
  try {
    const db = getDb();
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.isActive, true))
      .orderBy(asc(emergencyContacts.sortOrder));
  } catch {
    return [];
  }
}
