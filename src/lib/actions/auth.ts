"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormState = { error?: string };

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let user;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email.toLowerCase()))
      .limit(1);
    user = rows[0];
  } catch {
    return { error: "The database isn't connected yet. Set DATABASE_URL and try again." };
  }

  if (!user || !user.isActive) {
    return { error: "No account found with that email." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Incorrect password." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
