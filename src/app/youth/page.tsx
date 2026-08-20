import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Youth / SK Services" };

export default function YouthPage() {
  return (
    <ComingSoon
      title="Youth / SK Services"
      description="SK programs, sports, scholarships, and youth leadership at Barangay Sagayad."
      willInclude={[
        "SK Officials and committee assignments",
        "Youth programs, sports, and competitions",
        "Scholarships and skills training",
        "Youth events calendar",
      ]}
    />
  );
}
