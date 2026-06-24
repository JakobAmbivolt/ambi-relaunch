import { company } from "@/content/company";
import { Icon } from "@/components/ui/Icon";

export function OpeningHours() {
  const days = company.hours.filter((row) => row.days);

  return (
    <div>
      <h3 className="flex items-center gap-3 font-display text-xl font-bold text-ink">
        <Icon name="clock" className="h-5 w-5 flex-shrink-0 text-amber" />
        Öffnungszeiten
      </h3>

      <div className="mt-4 space-y-3">
        {days.map((row, i) => (
          <div key={i}>
            <p className="font-display font-bold text-ink">{row.days}:</p>
            {row.time.split("·").map((t, j) => (
              <p key={j} className="font-mono text-sm text-text">
                {t.trim()}
              </p>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-5 text-text">{company.hoursNote}</p>
    </div>
  );
}
