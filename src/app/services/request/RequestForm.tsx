"use client";

import { useActionState } from "react";
import { submitDocumentRequest, type RequestFormState } from "@/lib/actions/requests";
import { Button } from "@/components/ui/Button";

type ServiceOption = { id: string; name: string; slug: string; feeInfo: string | null };

const initialState: RequestFormState = {};

export function RequestForm({
  services,
  defaultServiceSlug,
}: {
  services: ServiceOption[];
  defaultServiceSlug?: string;
}) {
  const [state, formAction, pending] = useActionState(submitDocumentRequest, initialState);
  const defaultService = services.find((s) => s.slug === defaultServiceSlug);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Document type" htmlFor="serviceId" error={state.fieldErrors?.serviceId}>
        <select
          id="serviceId"
          name="serviceId"
          required
          defaultValue={defaultService?.id ?? ""}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        >
          <option value="" disabled>
            Choose a document type
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.feeInfo ? `— ${s.feeInfo}` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Full name" htmlFor="requesterName" error={state.fieldErrors?.requesterName}>
        <input
          id="requesterName"
          name="requesterName"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
          placeholder="Juan Dela Cruz"
        />
      </Field>

      <Field
        label="Phone number or email"
        htmlFor="requesterContact"
        error={state.fieldErrors?.requesterContact}
      >
        <input
          id="requesterContact"
          name="requesterContact"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
          placeholder="09XX XXX XXXX"
        />
      </Field>

      <Field label="Purpose (optional)" htmlFor="purpose">
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
          placeholder="What is this document for?"
        />
      </Field>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Submitting…" : "Submit Request"}
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
