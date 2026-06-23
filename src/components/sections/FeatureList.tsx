import { Icon } from "@/components/ui/Icon";

export function FeatureList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base text-text">
          <Icon name="check" className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
