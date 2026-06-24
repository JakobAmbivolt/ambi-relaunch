import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

const serviceLinks = [
  { label: "Kontakt", href: "/kontakt/" },
  { label: "Impressum", href: "/impressum/" },
  { label: "Datenschutzerklärung", href: "/datenschutzerklaerung/" },
  { label: "AGB & Widerrufsbelehrung", href: "/agb-widerruf/" },
  { label: "Cookie-Einstellungen", href: "#" },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-amber">{children}</h3>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-amber bg-slate-900 text-white/75">
      <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/ambivolt-logo.svg"
            alt={company.legalName}
            width={172}
            height={45}
            className="mb-5 h-auto w-auto"
          />
          <p className="text-sm leading-relaxed">{company.claim}</p>
        </div>
        <div>
          <ColHeading>Kontakt</ColHeading>
          <address className="space-y-2 text-sm not-italic">
            <p>{company.legalName}</p>
            <p>{company.street}, {company.zip} {company.city}</p>
            <p className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4 text-amber" /><a href={company.phoneHref} className="hover:text-amber">{company.phoneDisplay}</a></p>
            <p className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4 text-amber" /><a href={`mailto:${company.email}`} className="hover:text-amber">{company.email}</a></p>
          </address>
        </div>
        <div>
          <ColHeading>Öffnungszeiten</ColHeading>
          <ul className="space-y-2 text-sm">
            {company.hours.map((h, i) => (<li key={i}>{h.days && <span className="block font-medium text-white">{h.days}</span>}{h.time}</li>))}
          </ul>
        </div>
        <div>
          <ColHeading>Service</ColHeading>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((l) => (<li key={l.label}><Link href={l.href} className="hover:text-amber">{l.label}</Link></li>))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={company.social.facebook} aria-label="Facebook" className="text-white/60 transition-colors hover:text-amber"><Icon name="facebook" /></a>
            <a href={company.social.linkedin} aria-label="LinkedIn" className="text-white/60 transition-colors hover:text-amber"><Icon name="linkedin" /></a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/45 sm:flex-row">
          <span>© 2026 {company.legalName}</span>
          <span>
            Made with ♥ by{" "}
            <a href={company.agency.url} className="hover:text-amber">{company.agency.name}</a>
          </span>
        </Container>
      </div>
    </footer>
  );
}
