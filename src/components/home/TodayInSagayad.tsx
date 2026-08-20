import { Clock, HeartPulse, FileSearch, Megaphone } from "lucide-react";
import { Container, SectionHeading, Card, ToBeUpdated } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/data";

export function TodayInSagayad({
  settings,
  announcementCount,
}: {
  settings: SiteSettings;
  announcementCount: number;
}) {
  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading eyebrow={today} title="Today in Sagayad" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Clock className="text-brand-900" size={22} aria-hidden="true" />
          <p className="mt-3 font-bold text-brand-900">Barangay Hall</p>
          <p className="mt-1 text-sm text-ink-soft">
            {settings.officeHours ?? <ToBeUpdated />}
          </p>
        </Card>

        <Card>
          <HeartPulse className="text-teal-600" size={22} aria-hidden="true" />
          <p className="mt-3 font-bold text-brand-900">Health Schedule</p>
          <p className="mt-1 text-sm text-ink-soft">
            <ToBeUpdated label="Set up by health staff" />
          </p>
        </Card>

        <Card>
          <FileSearch className="text-gold-600" size={22} aria-hidden="true" />
          <p className="mt-3 font-bold text-brand-900">Document Requests</p>
          <p className="mt-1 text-sm text-ink-soft">Track a request you already submitted.</p>
          <Button href="/services/track" variant="outline" size="sm" className="mt-3">
            Track a request
          </Button>
        </Card>

        <Card>
          <Megaphone className="text-brand-900" size={22} aria-hidden="true" />
          <p className="mt-3 font-bold text-brand-900">Announcements</p>
          <p className="mt-1 text-sm text-ink-soft">
            {announcementCount > 0
              ? `${announcementCount} active announcement${announcementCount === 1 ? "" : "s"}`
              : "No active announcements right now."}
          </p>
        </Card>
      </div>
    </Container>
  );
}
