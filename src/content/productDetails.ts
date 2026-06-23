import data from "./product-details.json";

export type PdDownload = { label: string; url: string | null };
export type PdProduct = {
  name: string;
  anchor: string;
  subtitle: string;
  image: string | null;
  gallery: string[];
  features: string[];
  description: string;
  downloads: PdDownload[];
};
export type PdInquiry = { name: string; image: string | null };
export type PdPage = {
  slug: string;
  category: string;
  breadcrumb: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  intro: string;
  products: PdProduct[];
  pageDownloads: PdDownload[];
  inquiry: PdInquiry[];
  inquiryTitle: string;
  hasErgGrid: boolean;
};
export type ErgItem = { name: string; image: string | null; href: string };

const typed = data as { pages: PdPage[]; ergGrid: ErgItem[] };

export const ergGrid: ErgItem[] = typed.ergGrid;
export const productSlugs: string[] = typed.pages.map((p) => p.slug);

export function getProductPage(slug: string): PdPage | undefined {
  return typed.pages.find((p) => p.slug === slug);
}

// Beschreibungstext in Absätze (Original nutzt Doppel-Zeilenumbrüche)
export function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
