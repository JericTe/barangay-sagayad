import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { seedDatabase } from "../src/lib/db/seed-logic";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local first.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

seedDatabase(db, adminEmail && adminPassword ? { email: adminEmail, password: adminPassword } : null)
  .then((log) => {
    console.log("Seeding Barangay Sagayad database…");
    log.forEach((line) => console.log(`  ✓ ${line}`));
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
