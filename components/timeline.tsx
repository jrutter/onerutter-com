import type { YearEntry } from "@/lib/story";

export function Timeline({ years }: { years: YearEntry[] }) {
  return (
    <ol className="timeline">
      {years.map((year) => (
        <li key={`${year.datetime}-${year.place}`} id={year.id}>
          <div className="when">
            <time dateTime={year.datetime}>{year.when}</time>
            <span>{year.place}</span>
          </div>
          <p>{year.text}</p>
        </li>
      ))}
    </ol>
  );
}
