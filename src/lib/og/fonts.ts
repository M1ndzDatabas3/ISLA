import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "src/assets/fonts");

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600;
  style: "normal" | "italic";
};

/** "Archivo Display" é a semicondensada (títulos); "Archivo" é a largura normal (texto e interface). */
const files: { file: string; name: string; weight: OgFont["weight"]; style: OgFont["style"] }[] = [
  {
    file: "Archivo-SemiCondensed-SemiBold.ttf",
    name: "Archivo Display",
    weight: 600,
    style: "normal",
  },
  {
    file: "Archivo-SemiCondensed-Medium.ttf",
    name: "Archivo Display",
    weight: 500,
    style: "normal",
  },
  {
    file: "Archivo-SemiCondensed-MediumItalic.ttf",
    name: "Archivo Display",
    weight: 500,
    style: "italic",
  },
  { file: "Archivo-Regular.ttf", name: "Archivo", weight: 400, style: "normal" },
  { file: "Archivo-Medium.ttf", name: "Archivo", weight: 500, style: "normal" },
];

let cache: Promise<OgFont[]> | null = null;

/** Fontes TTF para o Satori (next/og). Carregadas uma vez por processo. */
export function loadOgFonts() {
  cache ??= Promise.all(
    files.map(async ({ file, ...meta }) => ({ ...meta, data: await readFile(join(dir, file)) })),
  );
  return cache;
}

type CardFont = Omit<OgFont, "weight"> & { weight: 400 | 500 };

/**
 * Fontes do card de citação (/og/citacao), no espírito dos lambes: Lora itálica
 * na citação, Oswald na atribuição. WOFF da Fontsource (o Satori não lê WOFF2);
 * a Archivo entra como reserva para algum caractere que falte.
 */
const cardFiles: {
  file: string;
  name: string;
  weight: CardFont["weight"];
  style: CardFont["style"];
}[] = [
  { file: "Lora-Italic.woff", name: "Lora", weight: 400, style: "italic" },
  { file: "Lora-Regular.woff", name: "Lora", weight: 400, style: "normal" },
  { file: "Oswald-Medium.woff", name: "Oswald", weight: 500, style: "normal" },
  { file: "Oswald-Regular.woff", name: "Oswald", weight: 400, style: "normal" },
  { file: "Archivo-Regular.ttf", name: "Archivo", weight: 400, style: "normal" },
];

let cardCache: Promise<CardFont[]> | null = null;

export function loadQuoteCardFonts() {
  cardCache ??= Promise.all(
    cardFiles.map(async ({ file, ...meta }) => ({
      ...meta,
      data: await readFile(join(dir, file)),
    })),
  );
  return cardCache;
}
