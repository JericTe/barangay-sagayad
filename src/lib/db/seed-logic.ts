import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
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
      address: "Barangay Hall Sagayad, San Fernando City, La Union, Philippines 2500",
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

  // --- Pages (CMS content blocks) -------------------------------------------
  // The opening is still a generic draft — not verified as his actual words.
  // The "Leadership and Community Projects" part below reflects specific
  // achievements barangay staff described directly (solar-powered water
  // system, ordinance enforcement, land titling work) — not independently
  // web-verified by me, same trust level as the officials roster and
  // address. The overall phrasing is still mine, so it's still worth his
  // read-through before treating it as final, even though the facts in it
  // came from the barangay, not invented.
  //
  // Upserted by slug (not insert-once) so pushing an edit and re-running
  // /setup actually updates this instead of silently skipping it.
  const pageSeeds: (typeof schema.pages.$inferInsert)[] = [
    {
      slug: "captains-message",
      title: "Message from the Punong Barangay",
      content:
        'Mahal kong mga kababayan ng Barangay Sagayad,\n\n' +
        'Malugod ko kayong tinatanggap sa aming bagong digital na serbisyo — isang bagong ' +
        'paraan upang mas madali ninyong maabot ang mga serbisyo, impormasyon, at anunsyo ng ' +
        'ating barangay, saan man kayo naroroon.\n\n' +
        'Layunin nating gawing mas mabilis at mas malinaw ang mga proseso — mula sa pagkuha ng ' +
        'dokumento, pag-uulat ng problema, hanggang sa pananatiling updated sa mga proyekto at ' +
        'gawain ng ating barangay. Ito ay bahagi ng aming patuloy na pagsisikap na maging bukas, ' +
        'mapagkakatiwalaan, at mas malapit sa bawat Sagayadeño.\n\n' +
        'Bilang inyong Punong Barangay, ipinagmamalaki ko ang ilan sa mga programang aming ' +
        'isinulong para sa ating barangay: ang aming solar-powered water refilling station, na ' +
        'nagbibigay ng ligtas na inuming tubig sa daan-daang sambahayan lalo na tuwing tag-init; ' +
        'ang aking tungkulin bilang deputized enforcer ng mga ordinansa ng lungsod, kasama ang ' +
        'mga awtoridad, para sa kapayapaan at kaayusan; at ang aming pakikipagtulungan sa antas-' +
        'probinsya para sa turnover ng land titles at tax declarations para sa mga residente ng ' +
        'Sagayad Resettlement area.\n\n' +
        'Maraming salamat sa inyong tiwala at patuloy na suporta.\n\n' +
        'Maglingkod nang buong puso,',
    },
  ];

  const currentPages = await db
    .select({ id: schema.pages.id, slug: schema.pages.slug })
    .from(schema.pages);
  const pageIdBySlug = new Map(currentPages.map((p) => [p.slug, p.id]));

  let pagesAdded = 0;
  let pagesUpdated = 0;

  for (const seed of pageSeeds) {
    const existingId = pageIdBySlug.get(seed.slug);
    if (existingId) {
      await db
        .update(schema.pages)
        .set({ ...seed, updatedAt: new Date() })
        .where(eq(schema.pages.id, existingId));
      pagesUpdated++;
    } else {
      await db.insert(schema.pages).values(seed);
      pagesAdded++;
    }
  }

  log.push(`Pages: ${pagesAdded} added, ${pagesUpdated} updated (captain's message is still a DRAFT for his review)`);

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
  // This batch (Police, Fire, DRRM, Health Office, LUECO, and all four
  // hospitals) was provided directly by barangay staff from a locally
  // circulated reference sheet — not independently web-verified by me, same
  // trust level as the address and officials roster. Multiple numbers per
  // entry are stored comma-separated; the Emergency page renders each as
  // its own tap-to-call button.
  //
  // Unlike officials/services (insert-once), this list is upserted by label
  // every time setup runs, so pushing a corrected number and re-running
  // setup actually takes effect — there's no admin edit UI for these yet.
  const emergencyContactSeeds: (typeof schema.emergencyContacts.$inferInsert)[] = [
    { label: "National Emergency Hotline", phone: "911", sortOrder: 0, sourceUrl: "https://www.ndrrmc.gov.ph" },
    { label: "Provincial DRRMO (La Union)", phone: "0998-561-1519", sortOrder: 1, sourceUrl: "https://launion.gov.ph" },
    {
      label: "City DRRMO (San Fernando City)",
      phone: "0928-522-0622, 0928-193-7818, 0917-676-7673",
      email: "citydrrmosanfernando@gmail.com",
      sortOrder: 2,
      sourceUrl: null,
    },
    {
      label: "Police (PNP)",
      phone: "0915-558-8888, 0939-813-6888, (072) 607-8954",
      notes: "San Fernando City Police Station",
      sortOrder: 3,
      sourceUrl: null,
    },
    {
      label: "Fire (BFP)",
      phone: "0917-183-8711",
      notes: "City of San Fernando Fire Station",
      sortOrder: 4,
      sourceUrl: null,
    },
    {
      label: "Health Office",
      phone: "(072) 888-6915, (072) 682-2883, 0928-391-5872",
      notes: "City Health Office, non-emergency health coordination",
      sortOrder: 5,
      sourceUrl: null,
    },
    {
      label: "LUECO (Power Outage / Downed Lines)",
      phone: "(072) 607-4790, (072) 607-3890, 0922-863-5745",
      notes: "La Union Electric Cooperative",
      sortOrder: 6,
      sourceUrl: null,
    },
    {
      label: "ITRMC",
      phone: "0910-563-5520, 0915-855-4459, (072) 607-2418, (072) 607-6422",
      notes: "Ilocos Training and Regional Medical Center — loc. 014-015",
      sortOrder: 7,
      sourceUrl: null,
    },
    {
      label: "Bethany Hospital",
      phone: "0917-518-0880, (072) 242-0804, (072) 888-2930",
      sortOrder: 8,
      sourceUrl: null,
    },
    {
      label: "Lorma Medical Center",
      phone: "0917-593-1390, (072) 888-2617, 0917-583-3069",
      sortOrder: 9,
      sourceUrl: null,
    },
    {
      label: "Lumed",
      phone: "0933-865-6503, (072) 607-8339, 0930-492-8341",
      sortOrder: 10,
      sourceUrl: null,
    },
  ];

  const currentContacts = await db
    .select({ id: schema.emergencyContacts.id, label: schema.emergencyContacts.label })
    .from(schema.emergencyContacts);
  const contactIdByLabel = new Map(currentContacts.map((c) => [c.label, c.id]));

  let contactsAdded = 0;
  let contactsUpdated = 0;

  for (const seed of emergencyContactSeeds) {
    const existingId = contactIdByLabel.get(seed.label);
    if (existingId) {
      await db
        .update(schema.emergencyContacts)
        .set({ ...seed, updatedAt: new Date() })
        .where(eq(schema.emergencyContacts.id, existingId));
      contactsUpdated++;
    } else {
      await db.insert(schema.emergencyContacts).values(seed);
      contactsAdded++;
    }
  }

  log.push(`Emergency contacts: ${contactsAdded} added, ${contactsUpdated} updated`);

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
