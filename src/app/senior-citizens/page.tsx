import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Senior Citizen Services" };

export default function SeniorCitizensPage() {
  return (
    <ComingSoon
      title="Senior Citizen Services"
      description="Programs, benefits, and events for Barangay Sagayad's senior residents."
      willInclude={[
        "Senior citizen registration and ID requirements",
        "Benefits and assistance programs",
        "Health programs for seniors",
        "Upcoming senior activities and events",
      ]}
    />
  );
}
