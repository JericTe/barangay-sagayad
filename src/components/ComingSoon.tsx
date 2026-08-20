import { Construction } from "lucide-react";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

export function ComingSoon({
  title,
  description,
  willInclude,
}: {
  title: string;
  description: string;
  willInclude: string[];
}) {
  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading eyebrow="Awaiting configuration" title={title} description={description} />

      <Card className="mt-8 max-w-2xl border-dashed">
        <div className="flex items-start gap-3">
          <Construction className="mt-0.5 shrink-0 text-gold-600" size={22} aria-hidden="true" />
          <div>
            <p className="font-semibold text-brand-900">This section is being built next.</p>
            <p className="mt-1 text-sm text-ink-soft">
              It will be filled in by barangay staff through the admin dashboard — nothing here
              is invented. Planned content:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {willInclude.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/contact" variant="outline">
          Contact the barangay hall in the meantime
        </Button>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
