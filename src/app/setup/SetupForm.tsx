"use client";

import { useActionState } from "react";
import { runSetupAction, type SetupState } from "./actions";
import { Button } from "@/components/ui/Button";

const initialState: SetupState = {};

export function SetupForm() {
  const [state, formAction, pending] = useActionState(runSetupAction, initialState);

  if (state.success) {
    return (
      <div>
        <p className="rounded-xl bg-teal-100 p-4 text-sm font-medium text-teal-700">
          Setup complete! You can sign in now.
        </p>
        <ul className="mt-4 space-y-1 text-sm text-ink-soft">
          {state.log?.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
        <Button href="/admin/login" className="mt-6 w-full">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="token" className="mb-1.5 block text-sm font-semibold text-ink">
          Setup key
        </label>
        <input
          id="token"
          name="token"
          type="password"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
        <p className="mt-1 text-xs text-ink-soft">The SETUP_TOKEN value you added in Vercel.</p>
      </div>
      <div>
        <label htmlFor="adminEmail" className="mb-1.5 block text-sm font-semibold text-ink">
          Choose your admin email
        </label>
        <input
          id="adminEmail"
          name="adminEmail"
          type="email"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label htmlFor="adminPassword" className="mb-1.5 block text-sm font-semibold text-ink">
          Choose your admin password
        </label>
        <input
          id="adminPassword"
          name="adminPassword"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
        <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
      </div>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Setting up…" : "Run Setup"}
      </Button>
    </form>
  );
}
