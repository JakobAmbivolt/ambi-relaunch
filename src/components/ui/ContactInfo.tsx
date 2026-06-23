import { company } from "@/content/company";
import { Icon } from "@/components/ui/Icon";

export function ContactInfo({ heading }: { heading?: string }) {
  return (
    <div>
      {heading && <h3 className="mb-4 text-xl font-bold text-ink">{heading}</h3>}
      <p className="font-semibold text-ink">{company.legalName}</p>
      <p className="text-text">
        {company.street}, {company.zip} {company.city}
      </p>
      <a
        href={company.phoneHref}
        className="mt-3 flex items-center gap-2 text-text hover:text-amber transition-colors"
      >
        <Icon name="phone" className="h-4 w-4 flex-shrink-0 text-amber" />
        <span>{company.phoneDisplay}</span>
      </a>
      <a
        href={`mailto:${company.email}`}
        className="mt-2 flex items-center gap-2 text-text hover:text-amber transition-colors"
      >
        <Icon name="mail" className="h-4 w-4 flex-shrink-0 text-amber" />
        <span>{company.email}</span>
      </a>
    </div>
  );
}
