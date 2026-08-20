"use client";

import { useActionState } from "react";
import { updateReportStatus, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const STATUSES = ["received", "under_review", "assigned", "in_progress", "resolved", "closed"];

const initialState: ActionState = {};

export function ReportStatusForm({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [state, formAction, pending] = useActionState(updateReportStatus, initialState);

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
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </Button>
      {state.success ? <span className="text-xs text-teal-700">Saved</span> : null}
      {state.error ? <span className="text-xs text-red-700">{state.error}</span> : null}
    </form>
  );
}
