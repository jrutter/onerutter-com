export const siteUrl = "https://onerutter.com";

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
