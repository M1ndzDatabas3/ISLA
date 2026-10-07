const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "7 de out. de 2026" → "7 out. 2026" (forma curta usada em cards). */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso)).replace(/ de /g, " ");
}

/** "7 de outubro de 2026". */
export function formatLongDate(iso: string): string {
  return longDateFormatter.format(new Date(iso));
}

export function formatReadingTime(minutes: number): string {
  return `${Math.max(1, Math.round(minutes))} min`;
}

/** Tempo de leitura a 200 palavras por minuto. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "1818–1883", "1944–" */
export function formatLifespan(born?: number, died?: number): string {
  if (!born) return "";
  return `${born}–${died ?? ""}`;
}
