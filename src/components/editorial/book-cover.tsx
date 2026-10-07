import type { Tradicao } from "@/lib/taxonomy";
import { cn, hashString } from "@/lib/utils";

/**
 * Capa tipográfica gerada, no espírito das coleções de bolso: um campo de cor
 * (branco, preto ou vermelho), um único sinal geométrico e o título em Archivo semicondensada.
 * Usada até existirem imagens licenciadas. Tamanhos em cqi: escala de miniatura a destaque.
 * O sinal fica na faixa do meio, longe do autor (topo) e do título (base).
 */

export type Scheme = "red" | "ink" | "paper";
export type Glyph = "disco" | "anel" | "linha" | "quadrado" | "diagonal" | "cunha";

const byTradition: Record<Tradicao, { scheme: Scheme; glyph: Glyph }> = {
  "marxismo-classico": { scheme: "red", glyph: "disco" },
  leninismo: { scheme: "red", glyph: "cunha" },
  trotskismo: { scheme: "ink", glyph: "diagonal" },
  maoismo: { scheme: "red", glyph: "quadrado" },
  anarquismo: { scheme: "ink", glyph: "anel" },
  "socialismo-democratico": { scheme: "paper", glyph: "disco" },
  "escola-de-frankfurt": { scheme: "paper", glyph: "quadrado" },
  "marxismo-ocidental": { scheme: "ink", glyph: "linha" },
  "teoria-marxista-da-dependencia": { scheme: "ink", glyph: "quadrado" },
  "marxismo-negro": { scheme: "ink", glyph: "diagonal" },
  "feminismo-marxista": { scheme: "paper", glyph: "anel" },
  ecossocialismo: { scheme: "paper", glyph: "linha" },
  "pensamento-decolonial": { scheme: "ink", glyph: "cunha" },
  "socialismo-latino-americano": { scheme: "paper", glyph: "linha" },
};

const schemes: Record<Scheme, { bg: string; fg: string; mark: string }> = {
  red: { bg: "var(--red)", fg: "var(--paper)", mark: "var(--paper)" },
  ink: { bg: "var(--ink)", fg: "var(--paper)", mark: "var(--red)" },
  paper: { bg: "var(--paper)", fg: "var(--ink)", mark: "var(--red)" },
};

interface BookCoverProps {
  titulo: string;
  autor: string;
  ano?: number;
  tradicao?: Tradicao;
  /** Esquema e sinal explícitos (ex.: pôster dos clássicos do Mural), no lugar da tradição. */
  scheme?: Scheme;
  glyph?: Glyph;
  /** Semente da variação (normalmente o slug). */
  seed: string;
  className?: string;
}

/**
 * Corpo do título em cqi: cabe a palavra mais longa sem quebrá-la no meio
 * (a largura útil é ~82cqi; a Archivo semicondensada 600 tem ~0,56em por letra).
 * Títulos longos descem um pouco para caberem em até quatro linhas.
 */
function titleSize(titulo: string) {
  const longest = Math.max(...titulo.split(/[\s-]+/).map((w) => w.length));
  const byWord = 80 / (0.56 * longest);
  const byLength = titulo.length > 44 ? 10.5 : titulo.length > 30 ? 12 : 13;
  return Math.min(byLength, byWord);
}

/** Evita palavra curta sozinha na última linha ("Livro I", "e a"). */
function noOrphan(titulo: string) {
  return titulo.replace(/ (\S{1,3})$/, "\u00a0$1");
}

export function BookCover({
  titulo,
  autor,
  ano,
  tradicao,
  scheme: schemeProp,
  glyph: glyphProp,
  seed,
  className,
}: BookCoverProps) {
  const base = tradicao
    ? byTradition[tradicao]
    : { scheme: "paper" as Scheme, glyph: "linha" as Glyph };
  const scheme = schemeProp ?? base.scheme;
  const glyph = glyphProp ?? base.glyph;
  const { bg, fg, mark } = schemes[scheme];
  const right = hashString(seed) % 2 === 1;

  return (
    <div
      aria-hidden
      className={cn("@container relative aspect-[2/3] overflow-hidden select-none", className)}
      style={{ backgroundColor: bg, color: fg }}
    >
      {scheme === "paper" ? <div className="absolute inset-0 border border-[#d4d4d4]" /> : null}
      {/* No tema escuro e nas seções em tinta, a capa preta some no fundo: um filete marca a borda */}
      {scheme === "ink" ? (
        <div className="absolute inset-0 hidden border border-white/15 dark:block [.tone-ink_&]:block" />
      ) : null}
      <Glyph glyph={glyph} color={mark} right={right} />
      <div className="relative flex h-full flex-col justify-between p-[9cqi]">
        <span className="font-sans text-[7cqi] leading-tight font-medium">{autor}</span>
        <span className="flex flex-col gap-[4cqi]">
          <span
            className="font-display leading-[1.04] text-balance hyphens-manual"
            style={{ fontSize: `${titleSize(titulo).toFixed(2)}cqi` }}
          >
            {noOrphan(titulo)}
          </span>
          {ano ? (
            <span className="font-sans text-[6cqi] tabular-nums opacity-75">{ano}</span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function Glyph({ glyph, color, right }: { glyph: Glyph; color: string; right: boolean }) {
  const side = right ? { right: "9cqi" } : { left: "9cqi" };
  switch (glyph) {
    case "disco":
      return (
        <span
          className="absolute top-[28%] aspect-square w-[30cqi] rounded-full"
          style={{ ...side, backgroundColor: color }}
        />
      );
    case "anel":
      return (
        <span
          className="absolute top-[27%] aspect-square w-[30cqi] rounded-full"
          style={{ ...side, boxShadow: `inset 0 0 0 1.4cqi ${color}` }}
        />
      );
    case "quadrado":
      return (
        <span
          className="absolute top-[28%] aspect-square w-[24cqi]"
          style={{ ...side, backgroundColor: color }}
        />
      );
    case "linha":
      return (
        <span
          className="absolute top-[36%] h-[1.4cqi] w-[46cqi]"
          style={{ ...side, backgroundColor: color }}
        />
      );
    case "diagonal":
      return (
        <span
          className="absolute top-[24%] h-[36cqi] w-[1.4cqi] origin-top"
          style={{
            left: right ? "64cqi" : "40cqi",
            backgroundColor: color,
            transform: `rotate(${right ? -24 : 24}deg)`,
          }}
        />
      );
    case "cunha":
      return (
        <span
          className="absolute top-[34%] h-[6cqi] w-[56cqi]"
          style={{
            ...side,
            backgroundColor: color,
            clipPath: right
              ? "polygon(100% 0, 0 50%, 100% 100%)"
              : "polygon(0 0, 100% 50%, 0 100%)",
          }}
        />
      );
  }
}
