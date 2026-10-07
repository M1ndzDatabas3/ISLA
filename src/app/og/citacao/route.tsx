import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { loadOgFonts } from "@/lib/og/fonts";
import { officialLogoData } from "@/lib/og/logo";
import { palette } from "@/lib/tokens";

/** Formatos: horizontal (X, Bluesky, link), quadrado (Instagram) e story (9:16). */
const formatos = {
  horizontal: { width: 1200, height: 630, pad: 72, fonte: 54, logo: 52 },
  quadrado: { width: 1080, height: 1080, pad: 88, fonte: 64, logo: 60 },
  story: { width: 1080, height: 1920, pad: 96, fonte: 76, logo: 68 },
} as const;

type Formato = keyof typeof formatos;

const limpar = (valor: string | null, max: number) =>
  (valor ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/** Imagem de uma citação para compartilhar: trecho, autor, fonte e a logo do Instituto. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const texto = limpar(params.get("texto"), 320);
  const autor = limpar(params.get("autor"), 80);
  const fonte = limpar(params.get("fonte"), 140);
  const formato: Formato =
    (params.get("formato") as Formato) in formatos
      ? (params.get("formato") as Formato)
      : "horizontal";
  const f = formatos[formato];

  if (!texto || !autor) return new Response("Informe texto e autor.", { status: 400 });

  // Citações longas encolhem para caber.
  const tamanho = Math.round(f.fonte * Math.min(1, Math.sqrt(160 / Math.max(texto.length, 160))));
  const [fonts, logo] = await Promise.all([loadOgFonts(), officialLogoData()]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: f.pad,
        background: palette.paper,
        color: palette.ink,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", width: 56, height: 6, background: palette.red }} />
      <div style={{ display: "flex", flexDirection: "column", gap: Math.round(f.pad / 2.4) }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo Display",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: tamanho,
            lineHeight: 1.18,
            letterSpacing: -0.5,
          }}
        >
          “{texto}”
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: Math.round(f.fonte * 0.44),
          }}
        >
          <span style={{ fontWeight: 500 }}>{autor}</span>
          {fonte ? <span style={{ color: palette.inkMuted }}>{fonte}</span> : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${palette.hair}`,
          paddingTop: Math.round(f.pad / 3),
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt="" height={f.logo} width={Math.round(f.logo * logo.ratio)} />
        ) : (
          <span style={{ fontWeight: 500, fontSize: 24 }}>
            Instituto Socialista Latino-Americano
          </span>
        )}
      </div>
    </div>,
    {
      width: f.width,
      height: f.height,
      fonts,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
