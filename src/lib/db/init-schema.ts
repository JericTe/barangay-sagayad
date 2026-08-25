import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import type * as schema from "./schema";

/**
 * Creates every table/type/index this app needs, directly from a browser
 * request (Vercel's server can reach Neon; the sandbox this was built in
 * could not, which is why this wasn't run automatically when the project
 * was scaffolded — see README).
 *
 * This is the same SQL drizzle-kit generated into drizzle/0000_pink_avengers.sql,
 * inlined here (rather than read from that file at runtime) so it doesn't
 * depend on Vercel's serverless bundler tracing a raw .sql file correctly.
 * If the schema changes later, regenerate with `npm run db:generate` and
 * update this constant to match.
 *
 * Safe to run repeatedly: tables/indexes use IF NOT EXISTS, and statements
 * that can't take IF NOT EXISTS in Postgres (CREATE TYPE, ADD CONSTRAINT)
 * are run individually and any "already exists" error is swallowed —
 * anything else still throws.
 */

const STATEMENTS = `
CREATE TYPE "public"."announcement_category" AS ENUM('emergency', 'government', 'health', 'education', 'senior', 'youth', 'public_works', 'peace_and_order', 'environment', 'livelihood', 'events');
CREATE TYPE "public"."announcement_status" AS ENUM('draft', 'published');
CREATE TYPE "public"."official_category" AS ENUM('punong_barangay', 'kagawad', 'sk_official', 'personnel');
CREATE TYPE "public"."report_status" AS ENUM('received', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE "public"."request_status" AS ENUM('submitted', 'under_review', 'approved', 'ready_for_pickup', 'released');
CREATE TYPE "public"."role" AS ENUM('super_admin', 'punong_barangay', 'secretary', 'treasurer', 'health_personnel', 'education_admin', 'project_manager', 'sk_admin', 'purok_coordinator', 'viewer');
CREATE TYPE "public"."service_category" AS ENUM('document', 'report', 'health', 'education', 'senior', 'youth', 'general');
CREATE TABLE "announcements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" "announcement_category" NOT NULL,
	"body" text NOT NULL,
	"image_url" text,
	"location" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"status" "announcement_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"author_id" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "document_requests" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_number" text NOT NULL,
	"service_id" text,
	"requester_name" text NOT NULL,
	"requester_contact" text NOT NULL,
	"purpose" text,
	"purok_id" text,
	"status" "request_status" DEFAULT 'submitted' NOT NULL,
	"notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "emergency_contacts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"phone" text,
	"email" text,
	"notes" text,
	"source_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"location" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"uploaded_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "officials" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"category" "official_category" NOT NULL,
	"committee" text,
	"responsibilities" text,
	"availability" text,
	"contact_email" text,
	"contact_phone" text,
	"photo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "pages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "puroks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" text NOT NULL,
	"name" text,
	"description" text,
	"leader_name" text,
	"leader_contact" text,
	"population" integer,
	"households" integer,
	"facilities" text,
	"photo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "reports" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_number" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"location" text,
	"purok_id" text,
	"photo_url" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"contact_name" text,
	"contact_phone" text,
	"status" "report_status" DEFAULT 'received' NOT NULL,
	"assigned_to_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "schedules" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"provider" text,
	"days" text,
	"hours" text,
	"location" text,
	"services_offered" text,
	"is_walk_in" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "schools" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"level" text,
	"address" text,
	"head_name" text,
	"contact" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "services" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" "service_category" NOT NULL,
	"description" text,
	"fee_info" text,
	"requirements" text,
	"processing_time" text,
	"icon" text,
	"is_requestable" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barangay_name" text DEFAULT 'Barangay Sagayad' NOT NULL,
	"tagline" text DEFAULT 'Serbisyo, Impormasyon, at Pakikilahok Para sa Lahat.' NOT NULL,
	"municipality" text DEFAULT 'City of San Fernando' NOT NULL,
	"province" text DEFAULT 'La Union' NOT NULL,
	"region" text DEFAULT 'Region I' NOT NULL,
	"address" text,
	"telephone" text,
	"mobile" text,
	"email" text,
	"office_hours" text,
	"facebook_url" text,
	"captain_facebook_url" text,
	"population" integer,
	"population_year" integer,
	"households" integer,
	"emergency_banner_active" boolean DEFAULT false NOT NULL,
	"emergency_banner_level" text DEFAULT 'info',
	"emergency_banner_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'viewer' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_purok_id_puroks_id_fk" FOREIGN KEY ("purok_id") REFERENCES "public"."puroks"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reports" ADD CONSTRAINT "reports_purok_id_puroks_id_fk" FOREIGN KEY ("purok_id") REFERENCES "public"."puroks"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reports" ADD CONSTRAINT "reports_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "announcements_slug_idx" ON "announcements" USING btree ("slug");
CREATE INDEX "announcements_status_idx" ON "announcements" USING btree ("status");
CREATE UNIQUE INDEX "document_requests_tracking_idx" ON "document_requests" USING btree ("tracking_number");
CREATE INDEX "officials_category_idx" ON "officials" USING btree ("category");
CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
CREATE UNIQUE INDEX "reports_reference_idx" ON "reports" USING btree ("reference_number");
CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
`;

function makeIdempotent(statement: string): string {
  if (/^CREATE TABLE "/i.test(statement)) {
    return statement.replace(/^CREATE TABLE "/i, 'CREATE TABLE IF NOT EXISTS "');
  }
  if (/^CREATE UNIQUE INDEX "/i.test(statement)) {
    return statement.replace(/^CREATE UNIQUE INDEX "/i, 'CREATE UNIQUE INDEX IF NOT EXISTS "');
  }
  if (/^CREATE INDEX "/i.test(statement)) {
    return statement.replace(/^CREATE INDEX "/i, 'CREATE INDEX IF NOT EXISTS "');
  }
  return statement;
}

export async function initSchema(db: NeonHttpDatabase<typeof schema>): Promise<string[]> {
  const log: string[] = [];
  const statements = STATEMENTS.split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  let created = 0;
  let alreadyExisted = 0;

  for (const raw of statements) {
    const statement = makeIdempotent(raw);
    try {
      await db.execute(sql.raw(statement));
      created++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/already exists/i.test(message)) {
        alreadyExisted++;
        continue;
      }
      throw err;
    }
  }

  log.push(`Database schema ready (${created} statements applied, ${alreadyExisted} already existed)`);
  return log;
}
