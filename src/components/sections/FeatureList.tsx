import { Icon } from "@/components/ui/Icon";

export function FeatureList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base text-ink">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-green/40 bg-green/10">
            <Icon name="check" className="h-3.5 w-3.5 text-green" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
