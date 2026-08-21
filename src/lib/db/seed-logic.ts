import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { hashPassword } from "../auth";

/**
 * Seeds ONLY information explicitly provided and verified in the product
 * brief: barangay identity, the named officials, the Punong Barangay's
 * public contact details, and the 2020 census population figure. Anything
 * not provided (addresses, phone numbers, fees, schedules, Purok data,
 * school data) is deliberately left out — it should be entered by barangay
 * staff through the admin dashboard, not guessed by a seed script.
 *
 * Shared by scripts/seed.ts (CLI, run against DATABASE_URL directly) and
 * src/app/setup/actions.ts (browser-based, runs on Vercel's servers using
 * the app's own already-connected database) so the data only lives in one
 * place.
 */

export async function seedDatabase(
  db: NeonHttpDatabase<typeof schema>,
  admin: { email: string; password: string } | null
): Promise<string[]> {
  const log: string[] = [];

  // --- Site settings -------------------------------------------------------
  const existingSettings = await db
    .select({ id: schema.siteSettings.id })
    .from(schema.siteSettings)
    .limit(1);

  if (existingSettings.length === 0) {
    await db.insert(schema.siteSettings).values({
      barangayName: "Barangay Sagayad",
      tagline: "Serbisyo, Impormasyon, at Pakikilahok Para sa Lahat.",
      municipality: "City of San Fernando",
      province: "La Union",
      region: "Region I",
      email: "theo.dacanay@gmail.com",
      facebookUrl: "https://www.facebook.com/LGUSAGAYAD",
      captainFacebookUrl: "https://www.facebook.com/KapTheoDacanay",
      population: 3164,
      populationYear: 2020,
    });
    log.push("Site settings created");
  } else {
    log.push("Site settings already present, skipped");
  }

  // --- Officials -------------------------------------------------------------
  // Kagawad roster cross-checked against the official City Government of San
  // Fernando La Union website (barangay officials directory, Sept 2025).
  const officialSeeds: (typeof schema.officials.$inferInsert)[] = [
    {
      name: 'Teodolfo "JR" G. Dacanay Jr.',
      position: "Punong Barangay",
      category: "punong_barangay",
      contactEmail: "theo.dacanay@gmail.com",
      photoUrl: "/images/officials/teodolfo-dacanay-jr.jpg",
      sortOrder: 0,
    },
    { name: "Sonny R. Dacanay", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 1 },
    { name: "Josel G. Abellera", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 2 },
    { name: "Anita F. Ardiente", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 3 },
    { name: "Celia A. Balancio", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 4 },
    { name: "Rolando C. Nisperos", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 5 },
    { name: "Elito N. Batulan", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 6 },
    { name: "Alvin G. Manuel", position: "Sangguniang Barangay Member", category: "kagawad", sortOrder: 7 },
    { name: "Jurey M. Manuel", position: "SK Chairman", category: "sk_official", sortOrder: 8 },
  ];

  const currentOfficials = await db.select({ name: schema.officials.name }).from(schema.officials);
  const existingNames = new Set(currentOfficials.map((o) => o.name));
  const officialsToInsert = officialSeeds.filter((o) => !existingNames.has(o.name));

  if (officialsToInsert.length > 0) {
    await db.insert(schema.officials).values(officialsToInsert);
    log.push(`Officials added (${officialsToInsert.length})`);
  } else {
    log.push("Officials already present, skipped");
  }

  // --- Services (document types) -------------------------------------------
  const serviceSeeds: (typeof schema.services.$inferInsert)[] = [
    { name: "Barangay Clearance", slug: "barangay-clearance", category: "document", isRequestable: true, sortOrder: 0 },
    { name: "Certificate of Residency", slug: "certificate-of-residency", category: "document", isRequestable: true, sortOrder: 1 },
    { name: "Certificate of Indigency", slug: "certificate-of-indigency", category: "document", isRequestable: true, sortOrder: 2 },
    { name: "Certificate of Good Moral Character", slug: "certificate-of-good-moral-character", category: "document", isRequestable: true, sortOrder: 3 },
    { name: "Barangay Business Clearance", slug: "barangay-business-clearance", category: "document", isRequestable: true, sortOrder: 4 },
    { name: "Other Certification", slug: "other-certification", category: "document", isRequestable: true, sortOrder: 5 },
  ];

  const currentServices = await db.select({ slug: schema.services.slug }).from(schema.services);
  const existingServiceBaseSlugs = new Set(
    currentServices.map((s) => s.slug.replace(/-[a-z0-9]+$/, ""))
  );
  const servicesToInsert = serviceSeeds.filter((s) => !existingServiceBaseSlugs.has(s.slug));

  if (servicesToInsert.length > 0) {
    await db.insert(schema.services).values(servicesToInsert);
    log.push(`Services added (${servicesToInsert.length})`);
  } else {
    log.push("Services already present, skipped");
  }

  // --- Emergency contacts --------------------------------------------------
  const emergencyContactSeeds: (typeof schema.emergencyContacts.$inferInsert)[] = [
    { label: "National Emergency Hotline", phone: "911", sortOrder: 0, sourceUrl: "https://www.ndrrmc.gov.ph" },
    { label: "Provincial DRRMO (La Union)", phone: "0998-561-1519", sortOrder: 1, sourceUrl: "https://launion.gov.ph" },
    {
      label: "City DRRMO (San Fernando City)",
      email: "citydrrmosanfernando@gmail.com",
      notes: "Local 7005100 — via City Hall trunk line",
      sortOrder: 2,
      sourceUrl: "https://cc.sanfernandocity.gov.ph",
    },
    {
      label: "Police (PNP)",
      phone: "072-700-5100",
      notes: "La Union Police Provincial Office — covers City of San Fernando",
      sortOrder: 3,
      sourceUrl: "https://www.facebook.com/launionpoliceprovincialofficeofficial/",
    },
    {
      label: "Fire (BFP)",
      phone: "072-607-7880",
      notes: "City of San Fernando Fire Station, Gov. Lucero St.",
      sortOrder: 4,
      sourceUrl: "https://bfpsanfernandocity.wordpress.com/",
    },
    {
      label: "Nearest Hospital",
      phone: "072-607-6418",
      notes: "Ilocos Training and Regional Medical Center (ITRMC) — Brgy. Parian",
      sortOrder: 5,
      sourceUrl: "https://www.facebook.com/ITRMC.dohgovph/",
    },
  ];

  const currentContacts = await db
    .select({ label: schema.emergencyContacts.label })
    .from(schema.emergencyContacts);
  const existingContactLabels = new Set(currentContacts.map((c) => c.label));
  const contactsToInsert = emergencyContactSeeds.filter((c) => !existingContactLabels.has(c.label));

  if (contactsToInsert.length > 0) {
    await db.insert(schema.emergencyContacts).values(contactsToInsert);
    log.push(`Emergency contacts added (${contactsToInsert.length})`);
  } else {
    log.push("Emergency contacts already present, skipped");
  }

  // --- Admin user --------------------------------------------------------
  if (!admin) {
    log.push("No admin credentials given — skipped admin user creation");
  } else {
    const passwordHash = await hashPassword(admin.password);
    await db
      .insert(schema.users)
      .values({
        name: "Super Admin",
        email: admin.email.toLowerCase(),
        passwordHash,
        role: "super_admin",
      })
      .onConflictDoNothing({ target: schema.users.email });
    log.push(`Admin user ready (${admin.email})`);
  }

  return log;
}
