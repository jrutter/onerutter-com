import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function renderOg({ title, kicker }: { title: string; kicker: string }) {
  const font = await readFile(path.join(process.cwd(), "mockups/fonts/outfit-600.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F3EEE6",
          color: "#1B1714",
          padding: "72px",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div style={{ width: 18, height: 18, borderRadius: 99, background: "#C45C32" }} />
          <span>Jake Rutter</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C45C32",
              fontWeight: 700,
            }}
          >
            {kicker}
          </div>
          <div style={{ fontSize: title.length > 60 ? 64 : 76, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 980 }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#5C564E" }}>onerutter.com</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Outfit", data: font, weight: 600, style: "normal" }],
    },
  );
}
