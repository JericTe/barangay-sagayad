import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Database client.
 *
 * Uses Neon's HTTP driver, which works over plain fetch — no TCP connection
 * pooling to manage, and it runs fine in Vercel's serverless/edge functions.
 * Any standard Postgres connection string works here (Neon, Supabase,
 * Railway, etc.) as long as it's reachable over HTTPS via Neon's driver, or
 * swap this file for `drizzle-orm/node-postgres` if you point at a
 * traditional long-lived Postgres connection instead.
 *
 * The client is created lazily (on first real query) rather than at module
 * load time, so that `next build` and pages that don't touch the database
 * still work before DATABASE_URL is configured — the site should never
 * hard-crash just because the database isn't wired up yet. Callers that DO
 * need the database should still surface a clear error, which db-safe.ts
 * turns into a graceful fallback for public pages.
 */

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Postgres connection string."
    );
  }

  const sql = neon(process.env.DATABASE_URL);
  _db = drizzle(sql, { schema });
  return _db;
}
