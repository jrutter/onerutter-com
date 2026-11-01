export type StoryArtPlacement =
  | "float-end"
  | "float-start"
  | "above-end"
  | "above-start"
  | "below-end"
  | "below-start";

export type StoryArt = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placement: StoryArtPlacement;
  wide?: boolean;
  sink?: boolean;
};

export const storyHeader = {
  src: "/story-art/header.svg",
  alt: "Linocut of a faceless figure at a laptop, with a shopping window, a page layout, and a small airplane.",
  width: 1200,
  height: 560,
} as const;

/** Keyed by `${datetime}-${place}` from `storyYears`. */
export const storyArt: Record<string, StoryArt> = {
  "1999-Stamford": {
    src: "/story-art/sailing.svg",
    alt: "A sailboat with two sails on the water.",
    width: 640,
    height: 400,
    placement: "below-start",
    wide: true,
  },
  "2001-Burlington": {
    src: "/story-art/web-design.svg",
    alt: "A pencil resting on a sketched web page.",
    width: 480,
    height: 460,
    placement: "float-end",
  },
  "2002-Rutter Interactive": {
    src: "/story-art/studio.svg",
    alt: "Two website windows and a folded newsletter.",
    width: 560,
    height: 440,
    placement: "above-start",
    wide: true,
  },
  "2003-Connecticut and New York": {
    src: "/story-art/front-end.svg",
    alt: "A browser window beside a diploma with a seal.",
    width: 560,
    height: 420,
    placement: "below-end",
  },
  "2008-Always Moving Forward": {
    src: "/story-art/journal.svg",
    alt: "An open journal, handwritten on one page and laid out like a blog on the other.",
    width: 560,
    height: 400,
    placement: "float-start",
    sink: true,
  },
  "2009-Direct Wines": {
    src: "/story-art/wine.svg",
    alt: "A wine bottle beside a phone showing a checkout.",
    width: 440,
    height: 520,
    placement: "float-end",
  },
  "2011-Smashing jQuery": {
    src: "/story-art/book.svg",
    alt: "A thick closed book with a clay spine.",
    width: 520,
    height: 380,
    placement: "below-start",
  },
  "2012-Web Designer": {
    src: "/story-art/magazine.svg",
    alt: "A magazine cover beside a phone with a simple mobile layout.",
    width: 520,
    height: 440,
    placement: "above-end",
    wide: true,
  },
  "2022-VF Corporation, Connecticut and Delaware": {
    src: "/story-art/apparel.svg",
    alt: "A jacket, a boot, and a small storefront window.",
    width: 560,
    height: 440,
    placement: "float-start",
  },
  "2025-SharkNinja, London": {
    src: "/story-art/dtc.svg",
    alt: "A faceless person at a laptop, with a small agent figure and a shopping bag.",
    width: 540,
    height: 480,
    placement: "float-end",
    sink: true,
  },
};
