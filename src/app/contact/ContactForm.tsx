"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/Button";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state.success) {
    return (
      <p className="rounded-xl bg-teal-100 p-4 text-sm font-medium text-teal-700">
        Message received. Thank you for reaching out to Barangay Sagayad.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Name" htmlFor="name" error={state.fieldErrors?.name}>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </Field>
      <Field label="Phone or email" htmlFor="contact" error={state.fieldErrors?.contact}>
        <input
          id="contact"
          name="contact"
          required
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </Field>
      <Field label="Subject (optional)" htmlFor="subject">
        <input
          id="subject"
          name="subject"
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </Field>
      <Field label="Message" htmlFor="message" error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base"
        />
      </Field>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
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
