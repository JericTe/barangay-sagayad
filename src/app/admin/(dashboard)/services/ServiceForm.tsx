"use client";

import { useActionState } from "react";
import { createService, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["document", "report", "health", "education", "senior", "youth", "general"];

const initialState: ActionState = {};

export function ServiceForm() {
  const [state, formAction, pending] = useActionState(createService, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Name</label>
        <input
          name="name"
          required
          placeholder="e.g. Barangay Clearance"
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
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Description (optional)
        </label>
        <input
          name="description"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Fee (optional)</label>
        <input
          name="feeInfo"
          placeholder="e.g. ₱50.00"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Processing time (optional)
        </label>
        <input
          name="processingTime"
          placeholder="e.g. Same day"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Requirements (optional)
        </label>
        <textarea
          name="requirements"
          rows={2}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>

      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="isRequestable" defaultChecked className="h-4 w-4" />
        Allow residents to request this online
      </label>

      <div className="sm:col-span-2">
        {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm font-medium text-teal-700">Service added.</p>
        ) : null}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Saving…" : "Add Service"}
        </Button>
      </div>
    </form>
  );
}
