import type { Metadata } from "next";
import { impressum, type LegalSection } from "@/content/m3";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  // Strip the redundant "Impressum" section heading — it would double under the h1
  // Cast to LegalSection[] because impressum is typed as M3Page & {sections: LegalSection[]},
  // and accessing LegalSection-specific fields (body) needs the explicit cast.
  const rawSections = (impressum.sections ?? []) as unknown as LegalSection[];
  const sections = rawSections.map((s) => ({
    paragraphs: s.paragraphs,
    body: s.body,
    heading: s.heading === "Impressum" ? undefined : s.heading,
  }));

  return <LegalPageLayout title="Impressum" sections={sections} />;
}
