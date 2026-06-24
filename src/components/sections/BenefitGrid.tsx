import { Icon } from "@/components/ui/Icon";

export function BenefitGrid({ items }: { items: { title: string; body?: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-4 bg-white p-6">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-green/40 bg-green/10">
            <Icon name="check" className="h-4 w-4 text-green" />
          </span>
          <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
          {item.body && <p className="text-sm text-text">{item.body}</p>}
        </div>
      ))}
    </div>
  );
}
