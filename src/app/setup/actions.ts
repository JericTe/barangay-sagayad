"use server";

import { getDb } from "@/lib/db";
import { initSchema } from "@/lib/db/init-schema";
import { seedDatabase } from "@/lib/db/seed-logic";

export type SetupState = {
  success?: boolean;
  log?: string[];
  error?: string;
};

export async function runSetupAction(_prevState: SetupState, formData: FormData): Promise<SetupState> {
  const token = formData.get("token")?.toString() ?? "";
  const expected = process.env.SETUP_TOKEN;

  if (!expected) {
    return {
      error:
        "SETUP_TOKEN isn't set in this deployment's environment variables yet, so this page is locked. Add it in Vercel → Settings → Environment Variables and redeploy.",
    };
  }
  if (token !== expected) {
    return { error: "That setup key doesn't match. Check Vercel → Settings → Environment Variables → SETUP_TOKEN." };
  }

  const adminEmail = formData.get("adminEmail")?.toString().trim();
  const adminPassword = formData.get("adminPassword")?.toString();

  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    return { error: "Enter an admin email and a password of at least 8 characters." };
  }

  try {
    const db = getDb();
    const schemaLog = await initSchema(db);
    const seedLog = await seedDatabase(db, { email: adminEmail, password: adminPassword });
    return { success: true, log: [...schemaLog, ...seedLog] };
  } catch (err) {
    return {
      error:
        "Couldn't reach the database. Make sure you've connected Neon Postgres under the Storage tab and redeployed. " +
        (err instanceof Error ? err.message : ""),
    };
  }
}
