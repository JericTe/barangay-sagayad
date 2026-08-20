"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
