"use client";

import { useActionState } from "react";
import { createOfficial, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  { value: "punong_barangay", label: "Punong Barangay" },
  { value: "kagawad", label: "Sangguniang Barangay (Kagawad)" },
  { value: "sk_official", label: "SK Official" },
  { value: "personnel", label: "Personnel (Secretary, Treasurer, BHW, etc.)" },
];

const initialState: ActionState = {};

export function OfficialForm() {
  const [state, formAction, pending] = useActionState(createOfficial, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Full name</label>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Position</label>
        <input
          name="position"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Category</label>
        <select
          name="category"
          required
          defaultValue=""
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        >
          <option value="" disabled>
            Choose a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Committee (optional)</label>
        <input
          name="committee"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Contact email (optional)</label>
        <input
          name="contactEmail"
          type="email"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Contact phone (optional)</label>
        <input
          name="contactPhone"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>

      <div className="sm:col-span-2">
        {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm font-medium text-teal-700">Official added.</p>
        ) : null}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Saving…" : "Add Official"}
        </Button>
      </div>
    </form>
  );
}
