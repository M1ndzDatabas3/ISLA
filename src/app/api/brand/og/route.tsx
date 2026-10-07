import { ImageResponse } from "next/og";

import { BrandMark } from "@/lib/og/brand-mark";
import { loadOgFonts } from "@/lib/og/fonts";
import { officialLogoData } from "@/lib/og/logo";
import { palette } from "@/lib/tokens";
import { siteConfig } from "@/site.config";

// Substituído por public/brand/og-default.png quando o arquivo existir; até lá usa a logo oficial.
export const dynamic = "force-static";

export async function GET() {
  const [fonts, logo] = await Promise.all([loadOgFonts(), officialLogoData()]);
  const lines = siteConfig.manifesto;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px 56px",
        background: palette.paper,
        color: palette.ink,
        fontFamily: "Archivo",
      }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt="" height={72} width={Math.round(72 * logo.ratio)} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandMark size={44} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1.18,
            }}
          >
            <span>Instituto Socialista</span>
            <span>Latino-Americano</span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Archivo Display",
          fontWeight: 600,
          fontSize: 88,
          lineHeight: 1,
          letterSpacing: -1.6,
        }}
      >
        {lines.map((line, index) =>
          index === lines.length - 1 ? (
            <span key={line} style={{ display: "flex", alignItems: "baseline" }}>
              {line.replace(/\.$/, "")}
              <span style={{ width: 13, height: 13, background: palette.red, marginLeft: 5 }} />
            </span>
          ) : (
            <span key={line}>{line}</span>
          ),
        )}
      </div>

      <div
        style={{
          display: "flex",
          paddingTop: 20,
          borderTop: `1px solid ${palette.hair}`,
          fontSize: 22,
          lineHeight: 1.4,
          color: palette.inkMuted,
        }}
      >
        <span style={{ maxWidth: 900 }}>{siteConfig.mission}</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}
