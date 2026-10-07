import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { loadOgFonts } from "@/lib/og/fonts";
import { officialLogoData } from "@/lib/og/logo";
import {
  capaDaExposicao,
  getArtista,
  getExposicao,
  getObra,
  localDoArtista,
  obraDeCapa,
} from "@/lib/mural";
import { labelOf } from "@/lib/taxonomy";

/** Formatos: horizontal (WhatsApp, X, link), quadrado (feed) e story (9:16). */
const formatos = {
  horizontal: { width: 1200, height: 630 },
  quadrado: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const;
type Formato = keyof typeof formatos;

const TINTA = "#111111";
const PAPEL = "#F5F5F5";
const CINZA = "#A3A3A3";
const VERMELHO = "#CD0000";

async function imagemComoDataUri(src: string) {
  const data = await readFile(join(process.cwd(), "public", src));
  const tipo = src.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${tipo};base64,${data.toString("base64")}`;
}

interface Conteudo {
  kicker: string;
  titulo: string;
  linha: string;
  credito: string;
  imagem: { src: string; largura: number; altura: number };
}

function conteudo(tipo: string, slug: string): Conteudo | null {
  if (tipo === "artista") {
    const a = getArtista(slug);
    const o = a ? obraDeCapa(a.slug) : undefined;
    if (!a || !o) return null;
    return {
      kicker: "Artista do Mural Cultural",
      titulo: a.nome,
      linha: `${localDoArtista(a)}. ${a.linguagens.map((l) => labelOf("linguagem", l)).join(", ")}.`,
      credito: `Obra: ${o.titulo}, ${o.ano}`,
      imagem: o.imagens[0]!,
    };
  }
  if (tipo === "obra") {
    const o = getObra(slug);
    const a = o ? getArtista(o.artista) : undefined;
    if (!o || !a) return null;
    return {
      kicker: "Mural Cultural",
      titulo: o.titulo,
      linha: `${a.nome}, ${o.ano}. ${o.tecnica}.`,
      credito: `${a.nome}, ${o.titulo}, ${o.ano}`,
      imagem: o.imagens[0]!,
    };
  }
  if (tipo === "exposicao") {
    const e = getExposicao(slug);
    const capa = e ? capaDaExposicao(e) : undefined;
    if (!e || !capa) return null;
    return {
      kicker: "Exposição do Mural Cultural",
      titulo: e.titulo,
      linha: e.subtitulo ?? `Curadoria: ${e.curadoria.join(", ")}`,
      credito: `Curadoria: ${e.curadoria.join(", ")}`,
      imagem: capa,
    };
  }
  return null;
}

/** Cabe a imagem inteira numa caixa, sem cortar (a obra é protagonista). */
function caber(img: { largura: number; altura: number }, w: number, h: number) {
  const escala = Math.min(w / img.largura, h / img.altura);
  return { width: Math.round(img.largura * escala), height: Math.round(img.altura * escala) };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tipo: string; slug: string }> },
) {
  const { tipo, slug } = await params;
  const dados = conteudo(tipo, slug);
  if (!dados) return new Response("Não encontrado.", { status: 404 });

  const pedido = request.nextUrl.searchParams.get("formato") as Formato | null;
  const formato: Formato = pedido && pedido in formatos ? pedido : "horizontal";
  const { width, height } = formatos[formato];
  const [fonts, logo, src] = await Promise.all([
    loadOgFonts(),
    officialLogoData("light"),
    imagemComoDataUri(dados.imagem.src),
  ]);

  const horizontal = formato === "horizontal";
  const pad = horizontal ? 56 : 72;
  const caixa = horizontal
    ? { w: 520, h: height - pad * 2 }
    : formato === "quadrado"
      ? { w: width - pad * 2, h: 540 }
      : { w: width - pad * 2, h: 1150 };
  const dim = caber(dados.imagem, caixa.w, caixa.h);
  const tituloTam = horizontal ? 64 : formato === "quadrado" ? 64 : 88;

  const texto = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", width: 36, height: 6, background: VERMELHO }} />
        <span style={{ fontSize: horizontal ? 22 : 26, color: CINZA }}>{dados.kicker}</span>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Archivo Display",
          fontWeight: 600,
          fontSize: tituloTam,
          lineHeight: 1.02,
          letterSpacing: -1.5,
          color: PAPEL,
        }}
      >
        {dados.titulo}
      </div>
      <div
        style={{ display: "flex", fontSize: horizontal ? 24 : 30, color: CINZA, lineHeight: 1.35 }}
      >
        {dados.linha}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #2E2E2E",
          paddingTop: 20,
          marginTop: 12,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.src}
            alt=""
            height={horizontal ? 44 : 56}
            width={Math.round((horizontal ? 44 : 56) * logo.ratio)}
          />
        ) : (
          <span style={{ fontSize: 22, color: PAPEL }}>Instituto Socialista Latino-Americano</span>
        )}
      </div>
    </div>
  );

  const obra = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: horizontal ? "flex-start" : "center",
        gap: 10,
      }}
    >
      {/* Filete de moldura: separa obras escuras do fundo sem alterar a imagem */}
      <div style={{ display: "flex", border: "1px solid #3A3A3A" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={dim.width} height={dim.height} />
      </div>
      <span style={{ fontSize: horizontal ? 16 : 22, color: CINZA }}>{dados.credito}</span>
    </div>
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        gap: horizontal ? 56 : 48,
        padding: pad,
        background: TINTA,
        color: PAPEL,
        fontFamily: "Archivo",
      }}
    >
      {obra}
      {texto}
    </div>,
    {
      width,
      height,
      fonts,
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    },
  );
}
