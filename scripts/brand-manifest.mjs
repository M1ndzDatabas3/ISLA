/**
 * Verifica quais arquivos oficiais da marca existem em public/brand/ e grava
 * src/components/brand/brand-manifest.json com o nome e as dimensões de cada um.
 * O <Logo />, o favicon e o OG padrão leem esse manifesto: basta colocar os
 * arquivos na pasta (SVG ou PNG) e rodar `pnpm dev` ou `pnpm build`.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand");
const out = join(root, "src", "components", "brand", "brand-manifest.json");

const variants = ["horizontal", "simbolo", "vertical"];
const tones = ["", "-light", "-dark"];

/** Chaves esperadas e extensões aceitas, em ordem de preferência. */
export const expected = {
  ...Object.fromEntries(
    variants.flatMap((v) => tones.map((t) => [`logo-${v}${t}`, ["svg", "png"]])),
  ),
  favicon: ["svg", "png"],
  "apple-touch-icon": ["png"],
  "icon-512": ["png"],
  "og-default": ["png", "jpg"],
};

function dimensions(path, ext) {
  const buf = readFileSync(path);
  if (ext === "png") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (ext === "svg") {
    const viewBox = buf
      .toString("utf8")
      .match(/viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/);
    if (viewBox) return { width: Math.round(+viewBox[1]), height: Math.round(+viewBox[2]) };
  }
  return null;
}

const files = {};
for (const [key, exts] of Object.entries(expected)) {
  for (const ext of exts) {
    const file = `${key}.${ext}`;
    const path = join(brandDir, file);
    if (existsSync(path)) {
      // Hash curto do conteúdo: muda a URL quando o arquivo muda (navegadores guardam favicon por muito tempo).
      const version = createHash("sha1").update(readFileSync(path)).digest("hex").slice(0, 8);
      files[key] = { file, ...dimensions(path, ext), version };
      break;
    }
  }
}

const next = JSON.stringify({ files }, null, 2) + "\n";
const current = existsSync(out) ? readFileSync(out, "utf8") : "";
if (current !== next) writeFileSync(out, next);

const found = Object.keys(files).length;
const total = Object.keys(expected).length;
console.log(
  found === 0
    ? "[marca] Nenhum arquivo oficial em public/brand/: usando a logo provisória."
    : `[marca] ${found} de ${total} arquivos oficiais encontrados${
        found < total
          ? ` (faltam: ${Object.keys(expected)
              .filter((k) => !files[k])
              .join(", ")})`
          : ""
      }.`,
);
