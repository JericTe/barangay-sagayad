"use client";

import { useActionState, useState } from "react";
import { submitReport, type ReportFormState } from "@/lib/actions/reports";
import { Button } from "@/components/ui/Button";
import { REPORT_CATEGORIES } from "@/lib/constants";

const initialState: ReportFormState = {};

export function ReportForm() {
  const [state, formAction, pending] = useActionState(submitReport, initialState);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Category" htmlFor="category" error={state.fieldErrors?.category}>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        >
          <option value="" disabled>
            Choose a category
          </option>
          {REPORT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" htmlFor="description" error={state.fieldErrors?.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
          placeholder="What's happening, and how long has it been going on?"
        />
      </Field>

      <Field label="Location / Purok" htmlFor="location">
        <input
          id="location"
          name="location"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
          placeholder="e.g. Purok 3, near the covered court"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isAnonymous"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-line"
        />
        Submit this report anonymously
      </label>

      {!anonymous && (
        <>
          <Field label="Your name (optional)" htmlFor="contactName">
            <input
              id="contactName"
              name="contactName"
              className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
            />
          </Field>
          <Field label="Phone number (optional)" htmlFor="contactPhone">
            <input
              id="contactPhone"
              name="contactPhone"
              className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
              placeholder="So staff can follow up if needed"
            />
          </Field>
        </>
      )}

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button type="submit" variant="danger" size="lg" className="w-full" disabled={pending}>
        {pending ? "Submitting…" : "Submit Report"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
