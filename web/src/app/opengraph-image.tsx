import { ImageResponse } from "next/og";

export const alt = "Gunratna Borkar — AI Engineer at CAMS, IIT Bombay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#15130f",
          padding: "70px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "2px solid #c97c2f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c97c2f",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            GB
          </div>
          <div style={{ color: "#b3a995", fontSize: 26 }}>AI Engineer · IIT Bombay</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f2ede3", fontSize: 84, fontWeight: 600, lineHeight: 1.05 }}>
            Gunratna Borkar
          </div>
          <div style={{ color: "#c97c2f", fontSize: 34, marginTop: 18 }}>
            Agentic AI · LLM/VLM Fine-tuning · RAG
          </div>
        </div>

        <div style={{ color: "#8a8170", fontSize: 24 }}>
          Sr. AI Engineer @ CAMS · 23 AMCs · Rs.47L Cr+ AUM
        </div>
      </div>
    ),
    { ...size }
  );
}
