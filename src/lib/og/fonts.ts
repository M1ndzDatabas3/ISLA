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
