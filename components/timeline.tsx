import Image from "next/image";
import type { YearEntry } from "@/lib/story";
import type { StoryArt } from "@/lib/story-art";

function eraClass(art: StoryArt) {
  return ["era", `era-${art.placement}`, art.wide ? "era-wide" : "", art.sink ? "era-sink" : ""]
    .filter(Boolean)
    .join(" ");
}

function EraPlate({ art }: { art: StoryArt }) {
  return (
    <figure className="era-art">
      <Image src={art.src} alt={art.alt} width={art.width} height={art.height} unoptimized />
    </figure>
  );
}

export function Timeline({ years, art }: { years: YearEntry[]; art?: Record<string, StoryArt> }) {
  return (
    <ol className="timeline">
      {years.map((year) => {
        const plate = art?.[`${year.datetime}-${year.place}`];
        const below = plate?.placement.startsWith("below");
        return (
          <li key={`${year.datetime}-${year.place}`} id={year.id}>
            <div className="when">
              <time dateTime={year.datetime}>{year.when}</time>
              <span>{year.place}</span>
            </div>
            {plate ? (
              <div className={eraClass(plate)}>
                {below ? null : <EraPlate art={plate} />}
                <p className="copy">{year.text}</p>
                {below ? <EraPlate art={plate} /> : null}
              </div>
            ) : (
              <p>{year.text}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
