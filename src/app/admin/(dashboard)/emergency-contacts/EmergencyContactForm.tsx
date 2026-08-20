"use client";

import { useActionState } from "react";
import { createEmergencyContact, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const initialState: ActionState = {};

export function EmergencyContactForm() {
  const [state, formAction, pending] = useActionState(createEmergencyContact, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Label (e.g. &ldquo;Police (PNP)&rdquo;)
        </label>
        <input
          name="label"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Phone</label>
        <input
          name="phone"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Email (optional)</label>
        <input
          name="email"
          type="email"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Notes (optional)</label>
        <input
          name="notes"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>

      <div className="sm:col-span-2">
        {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm font-medium text-teal-700">Contact added.</p>
        ) : null}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Saving…" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
}
