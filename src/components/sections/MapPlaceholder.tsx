import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { CornerTicks } from "@/components/ui/CornerTicks";
import { company } from "@/content/company";

export function MapPlaceholder() {
  return (
    <div className="relative mt-6 flex flex-col items-center gap-4 border border-line bg-surface p-6 text-center">
      <CornerTicks className="border-amber/40" />
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-line bg-white">
        <Icon name="pin" className="h-5 w-5 text-amber" />
      </span>
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
      >
        Routenplaner öffnen
      </Button>
    </div>
  );
}
