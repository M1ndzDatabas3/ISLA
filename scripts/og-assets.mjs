/**
 * Gera os recursos fixos dos cards de citação (src/assets/og):
 * - grao-escuro.png / grao-claro.png: ladrilhos de granulação para o "papel envelhecido";
 * - logo-horizontal-branca.png: a logo toda em branco (a versão light tem o símbolo
 *   vermelho, que some sobre o card vermelho), derivada da versão monocromática.
 * Rode de novo se trocar a logo: node scripts/og-assets.mjs
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const out = join(process.cwd(), "src/assets/og");
await mkdir(out, { recursive: true });

/** Ruído com semente fixa: o arquivo gerado é sempre o mesmo. */
function ruido(tamanho, cor, alfaMax, semente = 7) {
  let s = semente;
  const aleatorio = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const px = Buffer.alloc(tamanho * tamanho * 4);
  for (let i = 0; i < tamanho * tamanho; i++) {
    // Distribuição concentrada em valores baixos: grão fino, sem manchas.
    const a = Math.round(aleatorio() ** 2.2 * alfaMax * 255);
    px.set([cor, cor, cor, a], i * 4);
  }
  return sharp(px, { raw: { width: tamanho, height: tamanho, channels: 4 } }).png({
    compressionLevel: 9,
  });
}

await ruido(256, 0, 0.045).toFile(join(out, "grao-escuro.png"));
await ruido(256, 255, 0.05, 11).toFile(join(out, "grao-claro.png"));

const mono = join(process.cwd(), "public/brand/logo-horizontal-dark.png");
const { data, info } = await sharp(mono).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(join(out, "logo-horizontal-branca.png"));

console.log("[og] grão e logo branca gerados em src/assets/og");
