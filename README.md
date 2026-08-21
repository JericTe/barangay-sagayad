# Barangay Sagayad — Digital Barangay Hall

Official digital platform for Barangay Sagayad, City of San Fernando, La Union,
Philippines. Built as a real, working system — not a static template.

## Officials & emergency data — verification notes

**Officials roster**: cross-checked against the official City Government of
San Fernando La Union website (barangay officials directory, last updated
September 2025). The 7th kagawad seed was corrected from an initial
"Rizzalyn D. Fernando" to **Anita F. Ardiente** to match. The SK Chairman
name (Jurey M. Manuel) could not be independently verified against any
authoritative source and is seeded as originally provided — worth a
double-check with barangay staff.

**Emergency contacts**: each seeded number is cross-checked against an
official source (see `sourceUrl` on each entry in `scripts/seed.ts`) —
National Hotline (911), Provincial DRRMO, City DRRMO, Police (La Union PPO),
Fire (City of San Fernando Fire Station), and the regional hospital (ITRMC).
**Ambulance** is left unseeded — there's no single verified city-wide
ambulance line distinct from the DRRMO/hospital numbers already listed, and
guessing one would be worse than leaving it blank. A couple of these (fire
station in particular) were sourced from older official posts; landlines are
usually stable but barangay/city staff should confirm before relying on them
in a real emergency.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — custom civic design system (see `src/app/globals.css`)
- **Drizzle ORM** + **Neon Postgres** (serverless HTTP driver — no connection
  pooling to manage, works natively in Vercel's serverless functions)
- **Self-hosted fonts** (Sora + Public Sans, both open-source/OFL) — no
  runtime dependency on Google's font servers, which matters on slower
  provincial connections
- Auth: hand-rolled credentials + bcrypt + signed JWT session cookie (no
  external auth service required)

**Why Drizzle instead of Prisma**, since the original brief suggested Prisma:
Prisma's CLI downloads a Rust query-engine binary from its own CDN at
`generate`/`migrate` time. That domain was unreachable from the sandbox this
was built in, so it would have blocked development entirely. Drizzle is pure
TypeScript and talks to Postgres over HTTP — no binary, no build-time network
dependency, and it's a well-regarded, actively maintained ORM that pairs
naturally with Neon's serverless driver.

## What's built (Phase 1, working end-to-end)

- Homepage, Officials, Announcements (list + detail), Services directory,
  Puroks directory, Contact, Emergency Center
- **Document requests**: public form → generates tracking numbers
  (`SAG-2026-000000`) → public status-tracking page
- **Problem reports**: public form (13 categories from the brief) → reference
  numbers (`SGY-000000`) → public status-tracking page
- Admin dashboard: login, live overview counts, and management screens for
  Announcements, Document Requests (status + notes), Reports (status),
  Officials, Services, Emergency Contacts, and Site Settings
- Everything editable from the admin — no hard-coded contact info, fees, or
  content anywhere on the public site
- Accessibility: text-size toggle (A+/A−, persisted), large tap targets,
  visible focus states, `prefers-reduced-motion` support, tap-to-call phone
  links throughout
- SEO: metadata, Open Graph, sitemap.xml, robots.txt

## What's intentionally a placeholder

Puroks, the Ambulance emergency contact, school data, health/BHW/midwife
schedules, and fees/requirements per document type are all empty or "To be
updated" — the brief explicitly said not to invent this, so it's real,
editable, empty state rather than fabricated content. Health, Education,
Senior Citizen, and Youth sections are honest "coming soon" pages (Phase 2/3)
rather than dead links.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET (see below)
npm run db:generate          # already run once — only needed again after schema changes
npm run db:push              # creates the tables in your database
npm run db:seed              # seeds officials, site settings, services, verified emergency contacts
npm run dev
```

Visit `http://localhost:3000`. Sign in to `/admin/login` with the
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set before seeding.

## Environment variables

See `.env.example` for the full list with explanations. In short:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (Neon recommended — free, no card) |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Only for `db:seed` | Creates your first admin login |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used in SEO metadata |

## Deploying — entirely free

1. **Push this repo to GitHub** (already done if you're reading this there).
2. **Vercel** → New Project → Import the GitHub repo → Deploy. Free Hobby
   plan, no credit card.
3. In the Vercel project, open the **Storage** tab → **Neon Postgres** →
   Create → Connect. This automatically sets `DATABASE_URL` for you.
4. In **Settings → Environment Variables**, add `AUTH_SECRET` and
   `NEXT_PUBLIC_SITE_URL` (your `*.vercel.app` URL, or custom domain).
5. Redeploy. Then set it up — **no terminal needed**: visit
   `yoursite.vercel.app/setup`, enter the `SETUP_TOKEN` value you just set and
   your chosen admin email/password, and click Run Setup. It loads officials,
   services, and emergency contacts, and creates your admin login, all from
   the browser. (A CLI alternative — `npm run db:seed` — still exists if you
   have Node.js and prefer that.)
6. Sign in at `yoursite.vercel.app/admin/login` and start filling in the
   placeholders — starting with that officials discrepancy above. Then
   remove the `SETUP_TOKEN` environment variable so `/setup` can't be run
   again by anyone else.

## Project structure

```
src/
  app/                    Routes (App Router) — public pages + /admin
  components/
    layout/                Header, Footer, EmergencyBanner, TextSizeToggle
    home/                   Homepage sections
    ui/                     Design-system primitives (Button, Card, Badge, ...)
  lib/
    db/schema.ts            Drizzle schema — source of truth for the database
    data.ts                 Public-facing data-fetching (fails soft to defaults)
    auth.ts                 Session/password helpers
    actions/                Server Actions (forms write here)
scripts/seed.ts             Idempotent seed script — verified data only
drizzle/                    Generated SQL migrations
```

## Roadmap (Phases 2–5, from the original brief)

Health & BHW/midwife schedules, School directory, Purok admin CRUD, Senior/
PWD/Solo Parent/Youth sections, Business Directory, Jobs board, Community
Calendar, full Transparency/Budget/Projects module, Document Library, Barangay
Assembly, Resident accounts, Polls, Interactive + disaster maps, SMS/email
notifications, QR document verification, analytics.
