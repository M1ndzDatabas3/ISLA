/**
 * Marcações de revisão editorial: "[CONFERIR]" e "[CONFERIR tradução]" no
 * conteúdo. A fonte mantém o marcador (a equipe o encontra por busca); a tela
 * mostra uma etiqueta discreta ("tradução a conferir").
 */

export const CONFERIR_RE = /\[CONFERIR([^\]]*)\]/g;

export function isConferir(value: unknown): boolean {
  return typeof value === "string" && value.includes("[CONFERIR");
}

/** O valor, ou undefined se ele ainda estiver em revisão. */
export function known<T>(value: T): T | undefined {
  return isConferir(value) ? undefined : value;
}

/** "[CONFERIR tradução e edição]" → "tradução e edição a conferir"; "[CONFERIR]" → "a conferir". */
export function conferirLabel(marker: string): string {
  const detalhe = marker
    .replace(/^\[CONFERIR/, "")
    .replace(/\]$/, "")
    .trim();
  return detalhe ? `${detalhe} a conferir` : "a conferir";
}

export type ConferirPart = { kind: "text"; value: string } | { kind: "mark"; label: string };

/** Divide um texto em trechos normais e marcas de revisão. */
export function splitConferir(text: string): ConferirPart[] {
  const parts: ConferirPart[] = [];
  let last = 0;
  for (const match of text.matchAll(CONFERIR_RE)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ kind: "text", value: text.slice(last, start) });
    parts.push({ kind: "mark", label: conferirLabel(match[0]) });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}
