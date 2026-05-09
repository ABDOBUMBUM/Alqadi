import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Golden Al'Qadi Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #030303 0%, #1a1508 50%, #030303 100%)",
          color: "#e8c547",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>AL&apos;QADI</div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#f4f1ea" }}>
          مجموعة القاضي الذهبية
        </div>
        <div style={{ marginTop: 12, fontSize: 18, color: "#a8a29a" }}>
          سفر · سياحة · أيادي عاملة
        </div>
      </div>
    ),
    { ...size },
  );
}
