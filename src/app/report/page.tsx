import type { Metadata } from "next";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Report It to Sagayad",
  description: "Report a problem in Barangay Sagayad — broken streetlights, road damage, flooding, and more.",
};

export default function ReportPage() {
  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <SectionHeading
        eyebrow="Report It to Sagayad"
        title="Report a Problem"
        description="Tell us what's wrong and where. You'll get a reference number to follow up on."
      />

      <Card className="mt-4 border-dashed text-sm text-ink-soft">
        Photo attachments will be enabled once cloud file storage is configured — for now,
        describe the issue in as much detail as you can, including the nearest landmark.
      </Card>

      <Card className="mt-6">
        <ReportForm />
      </Card>
    </Container>
  );
}
