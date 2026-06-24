import { company } from "@/content/company";
import { Icon } from "@/components/ui/Icon";

const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${company.legalName}, ${company.street}, ${company.zip} ${company.city}`
)}`;

export function ContactInfo({ heading }: { heading?: string }) {
  return (
    <div>
      {heading && (
        <h3 className="font-display text-xl font-bold text-ink">{heading}</h3>
      )}
      <p className="mt-1 text-text">Ihr direkter Draht zu uns.</p>

      <ul className="mt-7 space-y-6">
        <li className="flex gap-4">
          <Icon name="phone" className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
          <div>
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text">
              Telefonisch
            </p>
            <a
              href={company.phoneHref}
              className="font-display font-bold text-amber transition-opacity hover:opacity-75"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </li>

        <li className="flex gap-4">
          <Icon name="mail" className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
          <div>
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text">
              E-Mail
            </p>
            <a
              href={`mailto:${company.email}`}
              className="font-display font-bold text-amber transition-opacity hover:opacity-75"
            >
              {company.email}
            </a>
          </div>
        </li>

        <li className="flex gap-4">
          <Icon name="pin" className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
          <div>
            <p className="font-display font-bold text-ink">{company.legalName}</p>
            <p className="text-text">
              {company.street}, {company.zip} {company.city}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-amber underline transition-opacity hover:opacity-75"
            >
              Routenplaner (Google Maps)
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
