import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth";

/**
 * Seeds ONLY information explicitly provided and verified in the product
 * brief: barangay identity, the named officials, the Punong Barangay's
 * public contact details, and the 2020 census population figure. Anything
 * not provided (addresses, phone numbers, fees, schedules, Purok data,
 * school data) is deliberately left out — it should be entered by barangay
 * staff through the admin dashboard, not guessed by a seed script.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local first.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding Barangay Sagayad database…");

  // --- Site settings -------------------------------------------------------
  const existingSettings = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings).limit(1);
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
      // address, telephone, mobile, officeHours intentionally left null —
      // shown as "To be updated" until barangay staff provide them.
    });
    console.log("  ✓ Site settings");
  } else {
    console.log("  · Site settings already present, skipping");
  }

  // --- Officials -------------------------------------------------------------
  // Kagawad roster cross-checked against the official City Government of San
  // Fernando La Union website (sanfernandocity.gov.ph, barangay officials
  // directory, last updated Sept 2025) — confirmed "Anita F. Ardiente" as the
  // correct 7th kagawad, replacing an initial "Rizzalyn D. Fernando" entry.
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

  // Simple existence check by name to keep the script idempotent.
  const currentOfficials = await db.select({ name: schema.officials.name }).from(schema.officials);
  const existingNames = new Set(currentOfficials.map((o) => o.name));
  const toInsert = officialSeeds.filter((o) => !existingNames.has(o.name));

  if (toInsert.length > 0) {
    await db.insert(schema.officials).values(toInsert);
    console.log(`  ✓ Officials (${toInsert.length} added)`);
  } else {
    console.log("  · Officials already present, skipping");
  }

  // --- Services (document types) -------------------------------------------
  // These are the certificate types explicitly named in the brief. Fees,
  // requirements, and processing times are left blank ("To be updated") —
  // only the barangay treasurer/secretary can confirm current amounts, and
  // publishing a guessed fee would be worse than admitting it's not set yet.
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
    console.log(`  ✓ Services (${servicesToInsert.length} added)`);
  } else {
    console.log("  · Services already present, skipping");
  }

  // --- Emergency contacts --------------------------------------------------
  // Each number below was cross-checked against an official source (city/
  // provincial government site, or the agency's own verified Facebook page)
  // — see sourceUrl on each entry. Ambulance is left unseeded: there's no
  // single verified city-wide ambulance line distinct from City DRRMO and
  // ITRMC above, and guessing one would be worse than leaving it blank.
  // Barangay staff should still confirm these directly before relying on
  // them in an actual emergency — some (like the fire station number) were
  // sourced from older official posts and landlines can change.
  const emergencyContactSeeds: (typeof schema.emergencyContacts.$inferInsert)[] = [
    {
      label: "National Emergency Hotline",
      phone: "911",
      sortOrder: 0,
      sourceUrl: "https://www.ndrrmc.gov.ph",
    },
    {
      label: "Provincial DRRMO (La Union)",
      phone: "0998-561-1519",
      sortOrder: 1,
      sourceUrl: "https://launion.gov.ph",
    },
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
  const contactsToInsert = emergencyContactSeeds.filter(
    (c) => !existingContactLabels.has(c.label)
  );

  if (contactsToInsert.length > 0) {
    await db.insert(schema.emergencyContacts).values(contactsToInsert);
    console.log(`  ✓ Emergency contacts (${contactsToInsert.length} added)`);
  } else {
    console.log("  · Emergency contacts already present, skipping");
  }

  // --- Admin user --------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(
      "  · Skipping admin user — set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your environment to create one."
    );
  } else {
    const passwordHash = await hashPassword(adminPassword);
    await db
      .insert(schema.users)
      .values({
        name: "Super Admin",
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: "super_admin",
      })
      .onConflictDoNothing({ target: schema.users.email });
    console.log(`  ✓ Admin user (${adminEmail})`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
