import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Archivo (Omnibus-Type, Buenos Aires): família única do site.
 * Variável em largura e peso: títulos na semicondensada (87%, peso 600),
 * leitura e interface na largura normal (400 e 500).
 */
export const fontArchivo = Archivo({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Só para blocos de código e BibTeX. */
export const fontMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const fontVariables = [fontArchivo, fontMono].map((font) => font.variable).join(" ");
