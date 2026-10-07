/**
 * Espelho em TypeScript dos tokens de cor de `src/app/globals.css`.
 * Usado onde CSS variables não existem (imagens OG via Satori) e na página /styleguide.
 * O teste `tokens.test.ts` falha se os dois arquivos divergirem.
 */

export const palette = {
  paper: "#FFFFFF",
  ink: "#0A0A0A",
  inkMuted: "#525252",
  red: "#CD0000",
  redDark: "#A30000",
  redText: "#CD0000",
  hair: "#E5E5E5",
} as const;

export const paletteDark = {
  background: "#0A0A0A",
  surface: "#171717",
  inkSection: "#000000",
  foreground: "#FFFFFF",
  muted: "#A3A3A3",
  red: "#CD0000",
  redText: "#FF4747",
} as const;

export type PaletteKey = keyof typeof palette;

/** Luminância relativa (WCAG 2.1). */
export function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** Razão de contraste WCAG entre duas cores hex. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Tokens de motion compartilhados entre CSS e GSAP. */
export const motion = {
  duration: { fast: 0.2, base: 0.5, slow: 0.9, hero: 1.1 },
  ease: "poster",
  easeCurve: ".22,1,.36,1",
  stagger: 0.06,
  distance: 28,
} as const;
