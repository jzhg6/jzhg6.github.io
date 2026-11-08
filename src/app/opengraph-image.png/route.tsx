import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "70px 80px", background: "#fafafa",
      color: "#171717", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30, fontWeight: 700 }}>
        {siteConfig.name}
        <span style={{ fontSize: 18, fontWeight: 400, color: "#777" }}>Research / Projects / Blog</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
        <div style={{ fontSize: 88, fontWeight: 700 }}>Hi, I&apos;m Ziheng.</div>
        <div style={{ fontSize: 32, color: "#626262" }}>Embodied AI · Intelligent Systems</div>
      </div>
      <div style={{ width: "100%", height: 2, background: "#dedede" }} />
    </div>,
    { width: 1200, height: 630 },
  );
}
