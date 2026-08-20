import type { Metadata } from "next";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { Container, SectionHeading, Card, ToBeUpdated } from "@/components/ui/primitives";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "./ContactForm";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Barangay Sagayad — address, phone, email, office hours, and social media.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading eyebrow="Get in Touch" title="Contact Barangay Sagayad" />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <dl className="space-y-4 text-sm">
              <InfoRow icon={<MapPin size={18} aria-hidden="true" />} label="Address">
                {settings.address ?? <ToBeUpdated />}
              </InfoRow>
              <InfoRow icon={<Phone size={18} aria-hidden="true" />} label="Telephone / Mobile">
                {settings.telephone ?? settings.mobile ? (
                  <PhoneLink phone={(settings.telephone ?? settings.mobile) as string} big />
                ) : (
                  <ToBeUpdated />
                )}
              </InfoRow>
              <InfoRow icon={<Mail size={18} aria-hidden="true" />} label="Email">
                {settings.email ?? <ToBeUpdated />}
              </InfoRow>
              <InfoRow icon={<Clock size={18} aria-hidden="true" />} label="Office Hours">
                {settings.officeHours ?? <ToBeUpdated />}
              </InfoRow>
            </dl>
          </Card>

          <Card>
            <p className="font-bold text-brand-900">Follow Barangay Sagayad</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium text-brand-700 hover:underline"
                >
                  <FacebookIcon size={16} /> Official Barangay Facebook
                </a>
              ) : null}
              {settings.captainFacebookUrl ? (
                <a
                  href={settings.captainFacebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium text-brand-700 hover:underline"
                >
                  <FacebookIcon size={16} /> Punong Barangay Facebook
                </a>
              ) : null}
            </div>
          </Card>
        </div>

        <Card>
          <p className="font-bold text-brand-900">Send a message</p>
          <p className="mt-1 text-sm text-ink-soft">
            Your message is delivered to the barangay&apos;s system for staff to review — for
            urgent matters, please call instead.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </Card>
      </div>
    </Container>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-brand-700">{icon}</span>
      <div>
        <dt className="font-medium text-ink-soft">{label}</dt>
        <dd className="text-ink">{children}</dd>
      </div>
    </div>
  );
}
