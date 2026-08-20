"use client";

import { useActionState } from "react";
import { updateRequestStatus, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const STATUSES = ["submitted", "under_review", "approved", "ready_for_pickup", "released"];

const initialState: ActionState = {};

export function RequestStatusForm({
  id,
  currentStatus,
  currentNotes,
}: {
  id: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const [state, formAction, pending] = useActionState(updateRequestStatus, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <input
        name="notes"
        defaultValue={currentNotes}
        placeholder="Note for the requester (optional)"
        className="flex-1 rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm"
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </Button>
      {state.success ? <span className="text-xs text-teal-700">Saved</span> : null}
      {state.error ? <span className="text-xs text-red-700">{state.error}</span> : null}
    </form>
  );
}
