"use client";

import { useActionState } from "react";
import { toggleServiceActive, type ActionState } from "../actions";
import { Button } from "@/components/ui/Button";

const initialState: ActionState = {};

export function ToggleServiceButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [, formAction, pending] = useActionState(toggleServiceActive, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isActive" value={String(isActive)} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {isActive ? "Hide" : "Unhide"}
      </Button>
    </form>
  );
}
