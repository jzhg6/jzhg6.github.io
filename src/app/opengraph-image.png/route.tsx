import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f2e8",
          color: "#211f1a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 700 }}>
            <span style={{ display: "flex", width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", background: "#e46f3d", color: "#fffaf1", fontSize: 22 }}>
              {siteConfig.shortName}
            </span>
            {siteConfig.name}
          </div>
          <span style={{ fontSize: 20, letterSpacing: "0.12em", color: "#55706d" }}>DIGITAL WORKLOG</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 700 }}>记录正在形成的想法与系统</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#69645b" }}>{siteConfig.description}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, color: "#69645b" }}>
          <span style={{ width: 46, height: 4, borderRadius: 2, background: "#55a89e" }} />
          文章 · 笔记 · 项目
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
