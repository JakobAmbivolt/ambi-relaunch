import data from "./m3-content.json";

export type Cta = { label?: string; href?: string };
export type M3Section = {
  name: string;
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  bullets?: string[];
  images?: string[];
  cta?: Cta;
};
export type Project = { name: string; image: string | null; kwp?: string };
export type Job = { title: string; body: string };
export type Benefit = { title: string; body?: string; icon?: string | null };
export type FormField = { label: string; type?: string; required?: boolean; options?: string[] };
export type PageForm = { title?: string; fields?: FormField[]; submitLabel?: string; captcha?: string };
export type ProgressBar = { label: string; percent: number };
export type LegalSection = { heading?: string; body?: string; paragraphs?: string[] };

export type M3Page = {
  url?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroBgImage?: string;
  sections?: M3Section[];
  projects?: Project[];
  jobs?: Job[];
  benefits?: Benefit[];
  progressBars?: ProgressBar[];
  form?: PageForm;
};

type LegalPage = { metaTitle: string; metaDescription: string; heroTitle: string; sections: LegalSection[] };

const d = data as unknown as {
  unternehmen: M3Page;
  "unsere-solarprojekte": M3Page;
  "jobs-und-stellenangebote": M3Page;
  "jetzt-bewerben": M3Page;
  kontakt: M3Page;
  "danke-fuer-ihre-anfrage": M3Page;
  impressum: M3Page & { sections: LegalSection[] };
  datenschutzerklaerung: LegalPage;
};

export const unternehmen = d.unternehmen;
export const solarprojekte = d["unsere-solarprojekte"];
export const jobsPage = d["jobs-und-stellenangebote"];
export const bewerben = d["jetzt-bewerben"];
export const kontakt = d.kontakt;
export const danke = d["danke-fuer-ihre-anfrage"];
export const impressum = d.impressum;
export const datenschutz = d.datenschutzerklaerung;

// Hilfsfunktion: Section nach name finden
export function section(page: M3Page, name: string): M3Section | undefined {
  return (page.sections || []).find((s) => s.name === name);
}
