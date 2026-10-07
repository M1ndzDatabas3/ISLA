import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import type { FormatoDoCard, TemaDoCard } from "@/lib/share/card-options";
import type { DadosDoCard } from "@/lib/share/quote-card";
import { siteConfig } from "@/site.config";

import { loadQuoteCardFonts } from "./fonts";
import { officialLogoData } from "./logo";

/**
 * Medidas por formato. Stories (9:16) reserva 250px no topo e 300px na base:
 * a interface do Instagram cobre essas faixas.
 * `corpo`: tamanho da citação até 120, 240 e 400 caracteres.
 */
const formatos = {
  quadrado: {
    largura: 1080,
    altura: 1080,
    lados: 96,
    topo: 92,
    base: 80,
    corpo: [70, 54, 40],
    aspas: 200,
    atribuicao: 30,
    meta: 25,
    logo: 52,
    respiro: 36,
  },
  stories: {
    largura: 1080,
    altura: 1920,
    lados: 96,
    topo: 250,
    base: 300,
    corpo: [90, 70, 52],
    aspas: 260,
    atribuicao: 40,
    meta: 31,
    logo: 64,
    respiro: 46,
  },
  link: {
    largura: 1200,
    altura: 630,
    lados: 64,
    topo: 52,
    base: 40,
    corpo: [44, 34, 26],
    aspas: 150,
    atribuicao: 22,
    meta: 18,
    logo: 36,
    respiro: 20,
  },
} as const;

/** Cores dos lambes: papel envelhecido, tinta e vermelho. */
const temas = {
  papel: {
    fundo: "#F3EEE4",
    texto: "#111111",
    suave: "#5C564C",
    destaque: "#C8102E",
    linha: "rgba(17,17,17,0.2)",
    grao: "escuro",
    logo: "color",
  },
  tinta: {
    fundo: "#111111",
    texto: "#F3EEE4",
    suave: "#ABA497",
    destaque: "#FF4747",
    linha: "rgba(243,238,228,0.22)",
    grao: "claro",
    logo: "light",
  },
  vermelho: {
    fundo: "#C8102E",
    texto: "#FFFFFF",
    suave: "rgba(255,255,255,0.86)",
    destaque: "#111111",
    linha: "rgba(255,255,255,0.4)",
    grao: "escuro",
    logo: "branca",
  },
} as const;

const ogDir = join(process.cwd(), "src/assets/og");
const dataUrl = async (file: string) =>
  `data:image/png;base64,${(await readFile(join(ogDir, file))).toString("base64")}`;

let recursos: Promise<{
  grao: Record<"escuro" | "claro", string>;
  logos: Record<"color" | "light" | "branca", { src: string; ratio: number } | null>;
}> | null = null;

/** Grão do papel e as três versões da logo, lidos uma vez por processo. */
function carregarRecursos() {
  recursos ??= (async () => {
    const [escuro, claro, color, light, branca] = await Promise.all([
      dataUrl("grao-escuro.png"),
      dataUrl("grao-claro.png"),
      officialLogoData("color"),
      officialLogoData("light"),
      dataUrl("logo-horizontal-branca.png"),
    ]);
    return {
      grao: { escuro, claro },
      // A versão branca deriva da oficial (scripts/og-assets.mjs): mesma proporção.
      logos: { color, light, branca: color ? { src: branca, ratio: color.ratio } : null },
    };
  })();
  return recursos;
}

const host = siteConfig.url.replace(/^https?:\/\//, "");

export async function quoteCardImage(
  dados: DadosDoCard,
  formato: FormatoDoCard,
  tema: TemaDoCard,
  headers: Record<string, string>,
) {
  const f = formatos[formato];
  const t = temas[tema];
  const [fonts, { grao, logos }] = await Promise.all([loadQuoteCardFonts(), carregarRecursos()]);
  const logo = logos[t.logo];

  const n = dados.texto.length;
  const corpo = f.corpo[n <= 120 ? 0 : n <= 240 ? 1 : 2];
  const horizontal = formato === "link";

  // Largura explícita: sem ela, a coluna do formato link não quebra a linha e vaza.
  const colunaDasAspas = horizontal ? Math.round(f.aspas * 0.62) : 0;

  const aspas = (
    <div
      style={{
        display: "flex",
        fontFamily: "Lora",
        fontStyle: "italic",
        fontSize: f.aspas,
        lineHeight: 1,
        color: t.destaque,
        // O glifo fica no alto da caixa: a margem negativa encosta a citação nele.
        height: Math.round(f.aspas * (horizontal ? 0.62 : 0.5)),
        marginLeft: Math.round(f.aspas * -0.04),
        ...(horizontal ? { width: colunaDasAspas, flexShrink: 0 } : {}),
      }}
    >
      “
    </div>
  );

  const citacao = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: f.largura - 2 * f.lados - colunaDasAspas,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Lora",
          fontStyle: "italic",
          fontSize: corpo,
          lineHeight: 1.3,
          letterSpacing: corpo * -0.004,
        }}
      >
        {dados.texto}
      </div>
      <div
        style={{
          display: "flex",
          width: Math.round(f.respiro * 2),
          height: horizontal ? 4 : 6,
          background: t.destaque,
          marginTop: f.respiro,
          marginBottom: Math.round(f.respiro * 0.6),
        }}
      />
      <div
        style={{
          display: "flex",
          fontFamily: "Oswald",
          fontWeight: 500,
          fontSize: f.atribuicao,
          letterSpacing: f.atribuicao * 0.07,
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {dados.atribuicao}
      </div>
      {[dados.fonte, dados.origem].filter(Boolean).map((linha) => (
        <div
          key={linha}
          style={{
            display: "flex",
            fontFamily: "Lora",
            fontSize: f.meta,
            lineHeight: 1.35,
            color: t.suave,
            marginTop: Math.round(f.meta * 0.35),
          }}
        >
          {linha}
        </div>
      ))}
    </div>
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: `${f.topo}px ${f.lados}px ${f.base}px`,
        background: t.fundo,
        color: t.texto,
        fontFamily: "Lora",
      }}
    >
      {/* Papel: grão fino em toda a superfície (gradientes radiais do Satori escurecem o card inteiro). */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: `url(${grao[t.grao]})`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
      {/* A citação fica centrada na altura livre; no formato link, as aspas viram uma coluna. */}
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: f.respiro,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: horizontal ? "row" : "column",
            alignItems: "flex-start",
          }}
        >
          {aspas}
          {citacao}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          borderTop: `1px solid ${t.linha}`,
          paddingTop: Math.round(f.respiro * 0.75),
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt="" height={f.logo} width={Math.round(f.logo * logo.ratio)} />
        ) : (
          <div style={{ display: "flex", fontFamily: "Oswald", fontSize: f.meta }}>
            {siteConfig.name}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            fontFamily: "Oswald",
            fontSize: f.meta,
            lineHeight: 1.3,
            letterSpacing: f.meta * 0.02,
            color: t.suave,
          }}
        >
          <span style={{ color: t.texto }}>{host}</span>
          <span>{dados.caminho}</span>
        </div>
      </div>
    </div>,
    { width: f.largura, height: f.altura, fonts, headers },
  );
}
