import { Icon } from "@/components/ui/Icon";

export function BenefitGrid({ items }: { items: { title: string; body?: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber">
            <Icon name="check" className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-ink">{item.title}</h3>
          {item.body && <p className="text-sm text-text">{item.body}</p>}
        </div>
      ))}
    </div>
  );
}
