import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cevrende — Pendik'te Mahallenden Usta ve Hizmet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background:
            "linear-gradient(135deg, #FAFAF7 0%, #F4F2EB 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#0F1110",
        }}
      >
        {/* Top: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0F1110",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FAFAF7",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Ç
          </div>
          Çevrende
        </div>

        {/* Center: main message */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#0F1110",
              maxWidth: 1040,
            }}
          >
            Çevrendekiler{" "}
            <span style={{ color: "#D4541C" }}>seni bulsun.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#5C5C57",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha
            fazlasını doğrudan bul.
          </div>
        </div>

        {/* Bottom: chips + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {["Ücretsiz", "Komisyonsuz", "Aracısız"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid #DAD7CC",
                  background: "#fff",
                  fontSize: 20,
                  color: "#2A2A28",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#5C5C57",
              fontWeight: 500,
            }}
          >
            cevrende.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
