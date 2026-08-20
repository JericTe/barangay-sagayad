import type { Metadata } from "next";
import { Container, Card } from "@/components/ui/primitives";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Staff Sign In" };

export default function AdminLoginPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-sm items-center py-14">
      <Card className="w-full">
        <p className="font-display text-xl font-bold text-brand-900">Staff &amp; Admin Sign In</p>
        <p className="mt-1 text-sm text-ink-soft">Barangay Sagayad internal dashboard.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </Container>
  );
}
