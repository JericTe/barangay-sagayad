import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Health Services" };

export default function HealthPage() {
  return (
    <ComingSoon
      title="Health Services"
      description="Maternal, child, and community health information for Barangay Sagayad."
      willInclude={[
        "Midwife and BHW schedules (days, hours, location)",
        "Immunization and vaccination programs",
        "Nutrition and family planning services",
        "Medical and dental mission announcements",
      ]}
    />
  );
}
