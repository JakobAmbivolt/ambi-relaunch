import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { company } from "@/content/company";

export function MapPlaceholder() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded border border-slate-200 bg-surface p-6 text-center">
      <Icon name="pin" className="h-8 w-8 text-amber" />
      <p className="text-sm text-text">
        {company.legalName}
        <br />
        {company.street}, {company.zip} {company.city}
      </p>
      <Button
        href="https://goo.gl/maps/vrrkSpwHgoMbFEiXA"
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        className="text-xs"
      >
        Routenplaner öffnen
      </Button>
    </div>
  );
}
