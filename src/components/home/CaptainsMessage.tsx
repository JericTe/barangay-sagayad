import Image from "next/image";
import { Container, SectionHeading, ToBeUpdated } from "@/components/ui/primitives";
import type { officials, pages } from "@/lib/db/schema";

type Official = typeof officials.$inferSelect;
type Page = typeof pages.$inferSelect;

export function CaptainsMessage({
  captain,
  page,
}: {
  captain: Official | undefined;
  page: Page | null;
}) {
  const name = captain?.name ?? "Teodolfo “JR” G. Dacanay Jr.";

  return (
    <section className="bg-brand-100/60 py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="From the Punong Barangay" title="Message from the Punong Barangay" />

        <div className="mt-8 flex flex-col gap-6 sm:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-900 text-white sm:h-40 sm:w-40">
            {captain?.photoUrl ? (
              <Image
                src={captain.photoUrl}
                alt={name}
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-3xl font-bold">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </div>

          <div className="max-w-2xl">
            <p className="font-display text-xl font-bold text-brand-900">{name}</p>
            <p className="text-sm text-ink-soft">Punong Barangay, Barangay Sagayad</p>

            <div className="mt-4 text-ink-soft">
              {page?.content ? (
                <p className="whitespace-pre-line">{page.content}</p>
              ) : (
                <ToBeUpdated label="A message will be added here from the admin dashboard." />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
