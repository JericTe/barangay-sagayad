import type { Metadata } from "next";
import { Container, Card } from "@/components/ui/primitives";
import { SetupForm } from "./SetupForm";

export const metadata: Metadata = { title: "Site Setup" };

export default function SetupPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-md items-center py-14">
      <Card className="w-full">
        <p className="font-display text-xl font-bold text-brand-900">Barangay Sagayad Setup</p>
        <p className="mt-1 text-sm text-ink-soft">
          One-time setup: loads officials, services, and emergency contacts, and creates your
          first admin login. Safe to run more than once — it won&apos;t duplicate anything.
        </p>
        <div className="mt-6">
          <SetupForm />
        </div>
        <p className="mt-6 text-xs text-ink-soft">
          After this succeeds, consider removing the <code>SETUP_TOKEN</code> environment
          variable in Vercel so this page can&apos;t be run by anyone else later.
        </p>
      </Card>
    </Container>
  );
}
