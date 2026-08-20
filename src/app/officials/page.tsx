import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Container, SectionHeading, Card, Badge, ToBeUpdated } from "@/components/ui/primitives";
import { getActiveOfficials } from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Barangay Officials",
  description: "Meet the Punong Barangay, Sangguniang Barangay members, and SK officials of Barangay Sagayad.",
};

const CATEGORY_LABELS: Record<string, string> = {
  punong_barangay: "Punong Barangay",
  kagawad: "Sangguniang Barangay",
  sk_official: "SK Officials",
  personnel: "Barangay Personnel",
};

export default async function OfficialsPage() {
  const officialsList = await getActiveOfficials();
  const captain = officialsList.find((o) => o.category === "punong_barangay");
  const kagawads = officialsList.filter((o) => o.category === "kagawad");
  const sk = officialsList.filter((o) => o.category === "sk_official");
  const personnel = officialsList.filter((o) => o.category === "personnel");

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Your Barangay Government"
        title="Meet Your Barangay Officials"
        description="Elected and appointed leaders serving Barangay Sagayad. All details here are managed by the barangay through the admin dashboard."
      />

      {captain ? (
        <Card className="mt-10 flex flex-col gap-6 border-brand-500/30 bg-brand-100/50 p-6 sm:flex-row sm:items-center">
          <OfficialAvatar name={captain.name} photoUrl={captain.photoUrl} size={112} />
          <div>
            <Badge tone="gold">Punong Barangay</Badge>
            <p className="mt-2 font-display text-2xl font-bold text-brand-900">{captain.name}</p>
            {captain.committee ? (
              <p className="text-sm text-ink-soft">{captain.committee}</p>
            ) : null}
            <ContactLine email={captain.contactEmail} phone={captain.contactPhone} />
          </div>
        </Card>
      ) : (
        <Card className="mt-10 border-dashed">
          <ToBeUpdated label="Punong Barangay profile not yet configured." />
        </Card>
      )}

      <OfficialGroup title={CATEGORY_LABELS.kagawad} items={kagawads} />
      <OfficialGroup title={CATEGORY_LABELS.sk_official} items={sk} />
      <OfficialGroup title={CATEGORY_LABELS.personnel} items={personnel} />
    </Container>
  );
}

function OfficialGroup({
  title,
  items,
}: {
  title: string;
  items: Awaited<ReturnType<typeof getActiveOfficials>>;
}) {
  return (
    <div className="mt-12">
      <h3 className="font-display text-lg font-bold text-brand-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">
          <ToBeUpdated />
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((o) => (
            <Card key={o.id}>
              <div className="flex items-center gap-3">
                <OfficialAvatar name={o.name} photoUrl={o.photoUrl} size={48} />
                <div>
                  <p className="font-bold text-brand-900">{o.name}</p>
                  <p className="text-sm text-ink-soft">{o.position}</p>
                </div>
              </div>
              {o.committee ? (
                <p className="mt-3 text-sm text-ink-soft">{o.committee}</p>
              ) : null}
              <ContactLine email={o.contactEmail} phone={o.contactPhone} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OfficialAvatar({
  name,
  photoUrl,
  size,
}: {
  name: string;
  photoUrl: string | null;
  size: number;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-900 font-display font-bold text-white"
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

function ContactLine({ email, phone }: { email: string | null; phone: string | null }) {
  if (!email && !phone) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
      {email ? (
        <span className="flex items-center gap-1">
          <Mail size={12} aria-hidden="true" /> {email}
        </span>
      ) : null}
      {phone ? (
        <span className="flex items-center gap-1">
          <Phone size={12} aria-hidden="true" /> {phone}
        </span>
      ) : null}
    </div>
  );
}
