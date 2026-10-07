import { ImageResponse } from "next/og";

import { loadOgFonts } from "@/lib/og/fonts";
import { officialLogoData } from "@/lib/og/logo";
import { palette } from "@/lib/tokens";
import { siteConfig } from "@/site.config";

export const ogSize = { width: 1200, height: 630 };

interface ContentCardInput {
  /** Seção ou tipo (ex.: "Biblioteca comentada", "Ensaio"). */
  kicker: string;
  title: string;
  subtitle?: string;
  /** Linha final, à direita da logo (autor, data, nível…). */
  meta?: string;
}

const corta = (texto: string, max: number) =>
  texto.length > max ? `${texto.slice(0, max - 1).trimEnd()}…` : texto;

/** Card OG das páginas de conteúdo: mesma linguagem do card de citação (branco, filete vermelho). */
export async function renderContentCard({ kicker, title, subtitle, meta }: ContentCardInput) {
  const [fonts, logo] = await Promise.all([loadOgFonts(), officialLogoData()]);
  const titulo = corta(title, 110);
  const tamanho = titulo.length > 70 ? 56 : titulo.length > 40 ? 68 : 80;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px 52px",
        background: palette.paper,
        color: palette.ink,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", width: 40, height: 6, background: palette.red }} />
        <span style={{ fontSize: 24, fontWeight: 500, color: palette.red }}>{kicker}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo Display",
            fontWeight: 600,
            fontSize: tamanho,
            lineHeight: 1.04,
            letterSpacing: -1.2,
          }}
        >
          {titulo}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              color: palette.inkMuted,
              maxWidth: 980,
            }}
          >
            {corta(subtitle, 150)}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${palette.hair}`,
          paddingTop: 22,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt="" height={56} width={Math.round(56 * logo.ratio)} />
        ) : (
          <span style={{ fontWeight: 500, fontSize: 24 }}>{siteConfig.name}</span>
        )}
        {meta ? <span style={{ fontSize: 22, color: palette.inkMuted }}>{meta}</span> : null}
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}
