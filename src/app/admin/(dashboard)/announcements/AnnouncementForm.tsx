"use client";

import { useActionState } from "react";
import { createAnnouncement, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  "emergency",
  "government",
  "health",
  "education",
  "senior",
  "youth",
  "public_works",
  "peace_and_order",
  "environment",
  "livelihood",
  "events",
];

const initialState: ActionState = {};

export function AnnouncementForm() {
  const [state, formAction, pending] = useActionState(createAnnouncement, initialState);

  return (
    <form
      action={formAction}
      key={state.success ? "reset" : "form"}
      className="space-y-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Title</label>
        <input
          name="title"
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
            <option key={c} value={c}>
              {c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Body</label>
        <textarea
          name="body"
          required
          rows={4}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPinned" className="h-4 w-4" />
          Pin to top
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="publishNow" defaultChecked className="h-4 w-4" />
          Publish immediately
        </label>
      </div>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="text-sm font-medium text-teal-700">Announcement saved.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Create Announcement"}
      </Button>
    </form>
  );
}
