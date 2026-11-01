import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Jake Rutter, Barnes, London";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    kicker: "Barnes, London",
    title: "I lead DTC engineering at SharkNinja, and I build small apps on the side.",
  });
}
