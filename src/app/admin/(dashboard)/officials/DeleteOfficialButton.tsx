"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteOfficial, type ActionState } from "../actions";

const initialState: ActionState = {};

export function DeleteOfficialButton({ id, name }: { id: string; name: string }) {
  const [, formAction, pending] = useActionState(deleteOfficial, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`Remove ${name} from the officials list?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Remove ${name}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
