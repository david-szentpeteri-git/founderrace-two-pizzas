import { ImageResponse } from "next/og";

export const alt = "Three Hellos: walk into any event knowing the three people you should say hello to.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Each word is its own box so the headline wraps like text.
const words = [
  ..."Walk into any event knowing the".split(" "),
  "three people",
  ..."you should say hello to.".split(" "),
];

// System fonts only, so the image never depends on a font download.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#18181b",
          padding: "72px 80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#18181b",
              color: "#bef264",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            3
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Three Hellos</div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: -2,
            maxWidth: 1040,
          }}
        >
          {words.map((w, i) =>
            w === "three people" ? (
              <span key={i} style={{ background: "#bef264", padding: "0 12px", borderRadius: 8, marginRight: 18 }}>
                {w}
              </span>
            ) : (
              <span key={i} style={{ marginRight: 18 }}>
                {w}
              </span>
            ),
          )}
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>three-hellos.vercel.app</div>
      </div>
    ),
    size,
  );
}
