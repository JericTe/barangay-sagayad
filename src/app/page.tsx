import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { QuickServices } from "@/components/home/QuickServices";
import { TodayInSagayad } from "@/components/home/TodayInSagayad";
import { AnnouncementsPreview } from "@/components/home/AnnouncementsPreview";
import { CaptainsMessage } from "@/components/home/CaptainsMessage";
import { Container } from "@/components/ui/primitives";
import {
  getSiteSettings,
  getActiveOfficials,
  getPublishedAnnouncements,
  getActivePuroks,
  getPageBySlug,
} from "@/lib/data";

export const revalidate = 60; // safety net: refresh at most every 60s even if a revalidatePath call is missed

export default async function HomePage() {
  const [settings, officialsList, announcementsList, puroksList, captainsMessagePage] =
    await Promise.all([
      getSiteSettings(),
      getActiveOfficials(),
      getPublishedAnnouncements(6),
      getActivePuroks(),
      getPageBySlug("captains-message"),
    ]);

  const captain = officialsList.find((o) => o.category === "punong_barangay");

  return (
    <>
      <Hero settings={settings} />
      <StatsStrip settings={settings} purokCount={puroksList.length} />

      <EmergencyContactsStrip />

      <QuickServices />
      <TodayInSagayad settings={settings} announcementCount={announcementsList.length} />
      <CaptainsMessage captain={captain} page={captainsMessagePage} />
      <AnnouncementsPreview items={announcementsList} />
    </>
  );
}

function EmergencyContactsStrip() {
  return (
    <div className="bg-red-100">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
          <PhoneCall size={16} aria-hidden="true" />
          Need help right now?
        </p>
        <Link
          href="/emergency"
          className="text-sm font-bold text-red-700 underline underline-offset-2"
        >
          View Sagayad Emergency Center →
        </Link>
      </Container>
    </div>
  );
}
