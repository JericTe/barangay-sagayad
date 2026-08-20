import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Education & Child Development" };

export default function EducationPage() {
  return (
    <ComingSoon
      title="Education & Child Development"
      description="School information, scholarships, and child development programs."
      willInclude={[
        "School directory with contacts and enrollment info",
        "Scholarship and educational assistance programs",
        "Child Development / preschool center details",
        "Youth training and TESDA programs",
      ]}
    />
  );
}
