import type { Metadata } from "next";
import { Container, SectionHeading, Card, ToBeUpdated } from "@/components/ui/primitives";
import { getActiveServices } from "@/lib/data";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = {
  title: "Request a Document",
  description: "Submit an online request for a Barangay Sagayad document or certificate.",
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const services = (await getActiveServices()).filter((s) => s.isRequestable);

  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <SectionHeading
        eyebrow="Online Document Request"
        title="Request a Document"
        description="Fill this in and we'll issue a tracking number so you can follow your request's progress."
      />

      {services.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <ToBeUpdated label="Online document requests aren't turned on yet — barangay staff need to publish at least one requestable service from the admin dashboard." />
        </Card>
      ) : (
        <Card className="mt-8">
          <RequestForm services={services} defaultServiceSlug={service} />
        </Card>
      )}
    </Container>
  );
}
