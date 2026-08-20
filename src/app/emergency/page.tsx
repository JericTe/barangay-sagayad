import type { Metadata } from "next";
import { Siren, PhoneCall } from "lucide-react";
import { Container, SectionHeading, Card, ToBeUpdated } from "@/components/ui/primitives";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { getSiteSettings, getActiveEmergencyContacts } from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export const metadata: Metadata = {
  title: "Emergency Center",
  description: "Barangay Sagayad emergency contacts, evacuation information, and active alerts.",
};

// Shown only when barangay staff haven't added a contact for this role yet —
// never a substitute for verified numbers, just a reminder of what's missing.
const EXPECTED_ROLES = ["Police (PNP)", "Fire (BFP)", "Ambulance", "Nearest Hospital"];

export default async function EmergencyPage() {
  const [settings, contacts] = await Promise.all([
    getSiteSettings(),
    getActiveEmergencyContacts(),
  ]);

  const missingRoles = EXPECTED_ROLES.filter(
    (role) => !contacts.some((c) => c.label.toLowerCase() === role.toLowerCase())
  );

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex items-center gap-3">
        <Siren className="text-red-600" size={28} aria-hidden="true" />
        <SectionHeading eyebrow="Stay Safe" title="Sagayad Emergency Center" className="mt-0" />
      </div>

      {settings.emergencyBannerActive && settings.emergencyBannerMessage ? (
        <Card className="mt-6 border-red-600/40 bg-red-100">
          <p className="font-bold text-red-700">Active Alert</p>
          <p className="mt-1 text-red-700">{settings.emergencyBannerMessage}</p>
        </Card>
      ) : (
        <Card className="mt-6 border-teal-500/40 bg-teal-100/60">
          <p className="font-medium text-teal-700">No active emergency alerts right now.</p>
        </Card>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {contacts.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-brand-900">{c.label}</p>
              {c.notes ? <p className="text-xs text-ink-soft">{c.notes}</p> : null}
            </div>
            {c.phone ? <PhoneLink phone={c.phone} big /> : <ToBeUpdated />}
          </Card>
        ))}

        {missingRoles.map((role) => (
          <Card key={role} className="flex items-center justify-between border-dashed">
            <span className="flex items-center gap-2 font-semibold text-brand-900">
              <PhoneCall size={16} aria-hidden="true" /> {role}
            </span>
            <ToBeUpdated />
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-dashed">
        <p className="font-bold text-brand-900">Evacuation centers &amp; routes</p>
        <p className="mt-1 text-sm text-ink-soft">
          <ToBeUpdated label="Barangay staff will publish evacuation center locations and routes here from the admin dashboard." />
        </p>
      </Card>

      <p className="mt-8 text-xs text-ink-soft">
        Numbers above are entered and kept current by barangay and city staff through the admin
        dashboard. If a number doesn&apos;t connect, please call the barangay hall directly.
      </p>
    </Container>
  );
}
