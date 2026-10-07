/**
 * Gera as imagens das obras de DEMONSTRAÇÃO do Mural (artistas fictícios).
 * Composições geométricas no estilo do site, sem copiar obras reais.
 * Uso: node scripts/mural-placeholders.mjs
 * Saída: public/mural/<artista>/<obra>/principal.jpg (+ alta.jpg nos cartazes).
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const R = "#CD0000";
const K = "#141414";
const P = "#F2EDE4";
const O = "#C8963E";
const FONT = "Helvetica, Arial, sans-serif";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

function rand(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const templates = {
  /** Xilogravura: sol nascendo, raios e sulcos de roça. */
  colheita(w, h) {
    const cx = w / 2,
      cy = h * 0.62;
    let rays = "";
    for (let i = 0; i < 36; i++) {
      const a1 = Math.PI + (i / 36) * Math.PI,
        a2 = a1 + Math.PI / 72;
      const L = w * 1.2;
      if (i % 2)
        rays += `<polygon points="${cx},${cy} ${cx + Math.cos(a1) * L},${cy + Math.sin(a1) * L} ${cx + Math.cos(a2) * L},${cy + Math.sin(a2) * L}" fill="${K}"/>`;
    }
    let furrows = "";
    for (let i = 0; i < 14; i++) {
      const y = cy + 20 + i * ((h - cy) / 14);
      furrows += `<path d="M0 ${y} Q ${w / 2} ${y - 30 - i * 3} ${w} ${y}" stroke="${P}" stroke-width="${3 + i * 0.6}" fill="none"/>`;
    }
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${P}"/>${rays}<circle cx="${cx}" cy="${cy}" r="${w * 0.2}" fill="${R}"/><rect y="${cy}" width="${w}" height="${h - cy}" fill="${K}"/>${furrows}`,
    );
  },
  /** Xilogravura: anéis concêntricos sobre disco vermelho. */
  solDoAgreste(w, h) {
    let rings = "";
    for (let r = w * 0.48; r > 20; r -= 22)
      rings += `<circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="none" stroke="${P}" stroke-width="6"/>`;
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${K}"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.42}" fill="${R}"/>${rings}<rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="${K}"/>`,
    );
  },
  /** Cordel: feira com barracas e bordas em zigue-zague. */
  feira(w, h) {
    const rnd = rand(7);
    let tents = "";
    const n = 7,
      tw = w / n;
    for (let i = 0; i < n; i++) {
      const x = i * tw,
        c = [R, K, O][i % 3],
        top = h * (0.32 + rnd() * 0.12);
      tents += `<polygon points="${x},${h * 0.62} ${x + tw / 2},${top} ${x + tw},${h * 0.62}" fill="${c}"/><rect x="${x + tw * 0.15}" y="${h * 0.62}" width="${tw * 0.7}" height="${h * 0.2}" fill="${i % 2 ? K : R}"/>`;
    }
    let zig = "";
    for (let x = 0; x < w; x += 40)
      zig += `<polygon points="${x},0 ${x + 20},36 ${x + 40},0" fill="${K}"/><polygon points="${x},${h} ${x + 20},${h - 36} ${x + 40},${h}" fill="${K}"/>`;
    return svg(w, h, `<rect width="${w}" height="${h}" fill="${P}"/>${tents}${zig}`);
  },
  /** Cartaz tipográfico com faixa diagonal. */
  cartaz(w, h, { linhas, fundo = R, faixa = K, texto = P, assinatura = "" }) {
    // O corpo cabe na linha mais longa (~0,64em por letra em negrito).
    const longest = Math.max(...linhas.map((l) => l.length));
    const size = Math.min(w * 0.2, (w * 0.86) / (longest * 0.64));
    const text = linhas
      .map(
        (l, i) =>
          `<text x="${w * 0.07}" y="${h * 0.56 + i * size * 0.98}" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${texto}" letter-spacing="-4">${l}</text>`,
      )
      .join("");
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${fundo}"/><polygon points="0,${h * 0.18} ${w},${h * 0.02} ${w},${h * 0.3} 0,${h * 0.46}" fill="${faixa}"/><circle cx="${w * 0.78}" cy="${h * 0.2}" r="${w * 0.1}" fill="${texto}"/>${text}<text x="${w * 0.07}" y="${h * 0.95}" font-family="${FONT}" font-weight="700" font-size="${w * 0.035}" fill="${texto}" letter-spacing="4">${assinatura}</text>`,
    );
  },
  /** Lambe-lambe: prédios com janelas acesas e palavra de ordem. */
  cidade(w, h, { linhas }) {
    const rnd = rand(11);
    let city = "";
    let x = 0;
    while (x < w) {
      const bw = w * (0.08 + rnd() * 0.1),
        bh = h * (0.25 + rnd() * 0.35);
      city += `<rect x="${x}" y="${h - bh}" width="${bw}" height="${bh}" fill="${K}"/>`;
      for (let wy = h - bh + 20; wy < h - 20; wy += 34)
        for (let wx = x + 12; wx < x + bw - 18; wx += 26)
          if (rnd() > 0.55)
            city += `<rect x="${wx}" y="${wy}" width="12" height="16" fill="${R}"/>`;
      x += bw + 6;
    }
    const size = w * 0.13;
    const text = linhas
      .map(
        (l, i) =>
          `<text x="${w * 0.07}" y="${h * 0.16 + i * size}" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${K}" letter-spacing="-2">${l}</text>`,
      )
      .join("");
    return svg(w, h, `<rect width="${w}" height="${h}" fill="${P}"/>${text}${city}`);
  },
  /** Mural noturno: fábrica, chaminés e lua ocre. */
  turnoDaNoite(w, h) {
    let fab = `<rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="${K}"/>`;
    for (let i = 0; i < 9; i++) {
      const x = w * (0.05 + i * 0.11);
      fab += `<polygon points="${x},${h * 0.55} ${x + w * 0.11},${h * 0.42} ${x + w * 0.11},${h * 0.55}" fill="${K}"/>`;
      for (let j = 0; j < 3; j++)
        fab += `<rect x="${x + w * 0.02 + j * w * 0.028}" y="${h * 0.62}" width="${w * 0.018}" height="${h * 0.08}" fill="${R}"/>`;
    }
    fab += `<rect x="${w * 0.7}" y="${h * 0.18}" width="${w * 0.035}" height="${h * 0.4}" fill="${K}"/><rect x="${w * 0.78}" y="${h * 0.25}" width="${w * 0.03}" height="${h * 0.33}" fill="${K}"/>`;
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="#2A2A2A"/><circle cx="${w * 0.2}" cy="${h * 0.24}" r="${h * 0.12}" fill="${O}"/>${fab}<rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="${R}"/>`,
    );
  },
  /** Gravura: engrenagem. */
  engrenagem(w, h) {
    let teeth = "";
    for (let i = 0; i < 16; i++)
      teeth += `<rect x="${w / 2 - w * 0.04}" y="${h * 0.12}" width="${w * 0.08}" height="${h * 0.12}" fill="${K}" transform="rotate(${i * 22.5} ${w / 2} ${h / 2})"/>`;
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${R}"/>${teeth}<circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.3}" fill="${K}"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.12}" fill="${P}"/>`,
    );
  },
  /** Ilustração: rio, barco e sol. */
  rio(w, h) {
    let waves = "";
    for (let i = 0; i < 16; i++) {
      const y = h * 0.5 + i * ((h * 0.5) / 16);
      waves += `<path d="M0 ${y} C ${w * 0.25} ${y - 18}, ${w * 0.5} ${y + 18}, ${w} ${y - 6}" stroke="${K}" stroke-width="5" fill="none"/>`;
    }
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${P}"/><circle cx="${w * 0.7}" cy="${h * 0.25}" r="${w * 0.14}" fill="${O}"/><polygon points="${w * 0.22},${h * 0.48} ${w * 0.5},${h * 0.48} ${w * 0.42},${h * 0.55} ${w * 0.28},${h * 0.55}" fill="${R}"/><rect x="${w * 0.35}" y="${h * 0.3}" width="6" height="${h * 0.18}" fill="${K}"/>${waves}`,
    );
  },
  /** Quadrinho: página com requadros. */
  quadrinho(w, h) {
    const m = w * 0.05,
      g = w * 0.025;
    const cw = (w - 2 * m - g) / 2,
      rh = (h - 2 * m - 2 * g) / 3;
    const panels = [
      [m, m, w - 2 * m, rh],
      [m, m + rh + g, cw, rh],
      [m + cw + g, m + rh + g, cw, rh],
      [m, m + 2 * (rh + g), cw * 1.3, rh],
      [m + cw * 1.3 + g, m + 2 * (rh + g), w - 2 * m - cw * 1.3 - g, rh],
    ];
    const inner = [
      (x, y, pw, ph) =>
        `<circle cx="${x + pw * 0.75}" cy="${y + ph * 0.4}" r="${ph * 0.25}" fill="${O}"/><rect x="${x}" y="${y + ph * 0.7}" width="${pw}" height="${ph * 0.3}" fill="${K}"/>`,
      (x, y, pw, ph) =>
        `<rect x="${x + pw * 0.3}" y="${y + ph * 0.2}" width="${pw * 0.4}" height="${ph * 0.8}" fill="${K}"/><circle cx="${x + pw * 0.5}" cy="${y + ph * 0.18}" r="${pw * 0.12}" fill="${K}"/>`,
      (x, y, pw, ph) =>
        `<ellipse cx="${x + pw * 0.5}" cy="${y + ph * 0.35}" rx="${pw * 0.38}" ry="${ph * 0.18}" fill="#fff" stroke="${K}" stroke-width="4"/><rect x="${x}" y="${y + ph * 0.7}" width="${pw}" height="${ph * 0.3}" fill="${R}"/>`,
      (x, y, pw, ph) =>
        `<polygon points="${x},${y + ph} ${x + pw / 2},${y + ph * 0.25} ${x + pw},${y + ph}" fill="${R}"/>`,
      (x, y, pw, ph) =>
        `<circle cx="${x + pw / 2}" cy="${y + ph / 2}" r="${Math.min(pw, ph) * 0.3}" fill="${K}"/>`,
    ];
    const body = panels
      .map(
        ([x, y, pw, ph], i) =>
          `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="${P}" stroke="${K}" stroke-width="6"/>${inner[i](x, y, pw, ph)}`,
      )
      .join("");
    return svg(w, h, `<rect width="${w}" height="${h}" fill="#FFFFFF"/>${body}`);
  },
  /** Fotografia em retícula: ladeiras e casario. */
  ladeiras(w, h) {
    let dots = "";
    const step = 22;
    for (let y = step / 2; y < h; y += step)
      for (let x = step / 2; x < w; x += step) {
        const hill = h * 0.45 + Math.sin((x / w) * Math.PI * 2.2) * h * 0.12 + (x / w) * h * 0.1;
        const t = y < hill ? 0.15 + (y / hill) * 0.25 : 0.55 + ((y - hill) / (h - hill)) * 0.4;
        dots += `<circle cx="${x}" cy="${y}" r="${(step / 2) * t}" fill="${K}"/>`;
      }
    return svg(
      w,
      h,
      `<rect width="${w}" height="${h}" fill="${P}"/>${dots}<rect x="${w * 0.62}" y="${h * 0.3}" width="${w * 0.05}" height="${h * 0.12}" fill="${R}"/>`,
    );
  },
};

/** [artista, obra, largura, altura, template, opções, gerar versão alta?] */
const obras = [
  ["coletivo-terra-riscada", "colheita", 1280, 1600, "colheita"],
  ["coletivo-terra-riscada", "sol-do-agreste", 1400, 1400, "solDoAgreste"],
  ["coletivo-terra-riscada", "feira", 1800, 1200, "feira"],
  [
    "mare-vermelha",
    "greve-geral",
    1200,
    1800,
    "cartaz",
    { linhas: ["GREVE", "GERAL"], assinatura: "MARÉ VERMELHA" },
    true,
  ],
  [
    "mare-vermelha",
    "a-cidade-e-nossa",
    1200,
    1800,
    "cidade",
    { linhas: ["A CIDADE", "É NOSSA"] },
    true,
  ],
  [
    "mare-vermelha",
    "memoria-preta",
    1200,
    1800,
    "cartaz",
    { linhas: ["MEMÓRIA", "PRETA"], fundo: K, faixa: R, texto: P, assinatura: "MARÉ VERMELHA" },
    true,
  ],
  ["oficina-chao-de-fabrica", "turno-da-noite", 2000, 1000, "turnoDaNoite"],
  ["oficina-chao-de-fabrica", "engrenagem", 1400, 1400, "engrenagem"],
  [
    "oficina-chao-de-fabrica",
    "primeiro-de-maio",
    1200,
    1800,
    "cartaz",
    {
      linhas: ["1º DE", "MAIO"],
      fundo: O,
      faixa: K,
      texto: K,
      assinatura: "OFICINA CHÃO DE FÁBRICA",
    },
    true,
  ],
  ["lua-cabocla", "rio-adentro", 1280, 1600, "rio"],
  ["lua-cabocla", "margens", 1200, 1800, "quadrinho"],
  ["taller-cerro-rojo", "ladeiras", 1800, 1200, "ladeiras"],
  [
    "taller-cerro-rojo",
    "memoria-e-justica",
    1200,
    1800,
    "cartaz",
    {
      linhas: ["MEMÓRIA", "E JUSTIÇA"],
      fundo: P,
      faixa: R,
      texto: K,
      assinatura: "TALLER CERRO ROJO",
    },
    true,
  ],
];

for (const [artista, obra, w, h, template, opts = {}, alta = false] of obras) {
  const dir = join(process.cwd(), "public/mural", artista, obra);
  mkdirSync(dir, { recursive: true });
  const buffer = Buffer.from(templates[template](w, h, opts));
  await sharp(buffer).jpeg({ quality: 82, mozjpeg: true }).toFile(join(dir, "principal.jpg"));
  if (alta) {
    await sharp(buffer, { density: 144 })
      .resize({ width: w * 2 })
      .jpeg({ quality: 90 })
      .toFile(join(dir, "alta.jpg"));
  }
  console.log(`[mural] ${artista}/${obra}`);
}
