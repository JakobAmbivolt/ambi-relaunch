import type { Metadata } from "next";
import { datenschutz } from "@/content/m3";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout
      title={datenschutz.heroTitle}
      sections={datenschutz.sections}
    />
  );
}
