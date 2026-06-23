import { company } from "@/content/company";

export function OpeningHours() {
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-ink">Öffnungszeiten:</h3>
      <ul className="space-y-1">
        {company.hours.map((row, i) => (
          <li key={i} className="text-text">
            {row.days && <span className="font-medium text-ink">{row.days}:</span>}{" "}
            {row.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
