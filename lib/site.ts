export const siteUrl = "https://onerutter.com";

/**
 * Travel stays in the repo and off the public site while this is false.
 * Trip files (`content/trips/`) and photographs (`public/travel/`) are kept.
 * Set this to true to restore the header link, the Story “See my travels”
 * link, `/travel`, album pages, `/trip-photos`, direct photo URLs, and the
 * sitemap entries.
 */
export const travelSectionPublic: boolean = false;

export const siteName = "Jake Rutter";

export const siteDescription =
  "I lead DTC engineering at SharkNinja, and I stay ahead by building, tinkering, and learning something new every week.";

export const profiles = [
  { href: "https://www.linkedin.com/in/jakerutter/", label: "LinkedIn" },
  { href: "https://jakerutter.medium.com/", label: "Medium" },
  { href: "https://jakerutter.substack.com/", label: "Substack" },
  { href: "https://twitter.com/jakerutter", label: "X" },
] as const;

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return new URL(path, siteUrl).toString();
}
