import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

const serviceLinks = [
  { label: "Kontakt", href: "/kontakt/" },
  { label: "Impressum", href: "/impressum/" },
  { label: "Datenschutzerklärung", href: "/datenschutzerklaerung/" },
  { label: "AGB & Widerrufsbelehrung", href: "/dokumente/agb.pdf" },
  { label: "Cookie-Einstellungen", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t-4 border-amber bg-slate-900 text-white/80">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/ambivolt-logo.svg" alt={company.legalName} width={160} height={40} className="mb-4 brightness-0 invert" />
          <p className="text-sm leading-relaxed">{company.claim}</p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Kontakt</h3>
          <address className="space-y-2 text-sm not-italic">
            <p>{company.legalName}</p>
            <p>{company.street}, {company.zip} {company.city}</p>
            <p className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4" /><a href={company.phoneHref} className="hover:text-amber">{company.phoneDisplay}</a></p>
            <p className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" /><a href={`mailto:${company.email}`} className="hover:text-amber">{company.email}</a></p>
          </address>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Öffnungszeiten</h3>
          <ul className="space-y-2 text-sm">
            {company.hours.map((h, i) => (<li key={i}>{h.days && <span className="block font-medium text-white">{h.days}</span>}{h.time}</li>))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Service</h3>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((l) => (<li key={l.label}><Link href={l.href} className="hover:text-amber">{l.label}</Link></li>))}
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={company.social.facebook} aria-label="Facebook" className="hover:text-amber"><Icon name="facebook" /></a>
            <a href={company.social.linkedin} aria-label="LinkedIn" className="hover:text-amber"><Icon name="linkedin" /></a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        Copyright © 2026 {company.legalName} · Made with ♥ by{" "}
        <a href={company.agency.url} className="hover:text-amber">{company.agency.name}</a>
      </div>
    </footer>
  );
}
