/**
 * Retícula de "foto de acervo" gerada: uma manifestação com bandeira.
 * É uma imagem ilustrativa, usada até existirem fotos históricas em domínio
 * público com crédito conferido. Funções puras; o desenho é determinístico pela semente.
 */

export interface HalftoneColors {
  background: string;
  dot: string;
  flag: string;
}

export const halftoneTones = {
  /** Retícula preta sobre branco, bandeira vermelha. */
  paper: { background: "#FFFFFF", dot: "#0A0A0A", flag: "#CD0000" },
  /** Retícula vermelha sobre preto, bandeira branca. */
  ink: { background: "#0A0A0A", dot: "#CD0000", flag: "#FFFFFF" },
} satisfies Record<string, HalftoneColors>;

export type HalftoneTone = keyof typeof halftoneTones;

interface Head {
  x: number;
  y: number;
  rad: number;
}

interface Arm {
  x: number;
  y0: number;
  y1: number;
  rad: number;
}

interface Scene {
  heads: Head[];
  arms: Arm[];
  pole: number;
}

/** Gerador pseudoaleatório determinístico (mulberry32). */
export function seededRandom(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildScene(seed: number, aspect: number, horizon: number): Scene {
  const random = seededRandom(seed);
  const heads: Head[] = [];
  const count = Math.round(30 * Math.max(1, aspect));
  for (let i = 0; i < count; i++) {
    const depth = random();
    heads.push({
      x: random() * 1.1 - 0.05,
      y: horizon + depth * (0.98 - horizon),
      rad: 0.034 + depth * 0.045,
    });
  }
  heads.sort((a, b) => a.y - b.y);

  const arms: Arm[] = [];
  for (let j = 0; j < 7; j++) {
    const head = heads[Math.floor(random() * heads.length * 0.7)]!;
    arms.push({
      x: head.x + (random() - 0.5) * head.rad * 1.6,
      y0: head.y + head.rad,
      y1: head.y - 0.13 - random() * 0.08,
      rad: head.rad * 0.8,
    });
  }
  return { heads, arms, pole: 0.58 + random() * 0.12 };
}

/** Escuridão (0 a 1) no ponto (u, v) da imagem, e se o ponto pertence à bandeira. */
function sample(u: number, v: number, scene: Scene, aspect: number) {
  let d = 0.06 + 0.16 * v;
  let flag = false;

  if (Math.abs(u - scene.pole) * aspect < 0.006 && v > 0.07 && v < 0.8) d = 0.8;

  const flagWidth = 0.3 / Math.max(1, aspect * 0.7);
  if (u > scene.pole && u < scene.pole + flagWidth) {
    const t = (u - scene.pole) / flagWidth;
    const top = 0.08 + 0.035 * Math.sin(t * 5.2) + 0.02 * t;
    const bottom = top + 0.2 - 0.03 * t;
    if (v > top && v < bottom) {
      d = 0.86 - 0.3 * Math.max(0, Math.sin(t * 5.2 + 1.3));
      flag = true;
    }
  }

  for (const arm of scene.arms) {
    const ax = (u - arm.x) * aspect;
    if (v < arm.y0 && v > arm.y1 && Math.abs(ax) < arm.rad * 0.32) d = Math.max(d, 0.72);
    const dy = v - arm.y1;
    if (ax * ax + dy * dy < arm.rad * arm.rad * 0.8) d = Math.max(d, 0.74);
  }

  for (const head of scene.heads) {
    const dx = (u - head.x) * aspect;
    const dy = v - head.y;
    if (dx * dx + dy * dy < head.rad * head.rad) {
      d = Math.max(d, 0.5 + 0.12 * (head.y - 0.5));
      flag = false;
    }
    const sx = dx / (head.rad * 2.4);
    const sy = (v - (head.y + head.rad * 1.9)) / (head.rad * 1.6);
    if (sx * sx + sy * sy < 1) {
      d = Math.max(d, 0.44 + 0.12 * (head.y - 0.5));
      flag = false;
    }
  }
  return { d, flag };
}

export interface DrawOptions {
  seed: number;
  /** Altura (0 a 1) onde começa a multidão. */
  horizon?: number;
  colors: HalftoneColors;
}

/** Desenha a retícula no contexto 2D, em pixels CSS (o chamador cuida do devicePixelRatio). */
export function drawHalftone(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: DrawOptions,
) {
  const { seed, horizon = 0.55, colors } = options;
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  const aspect = width / height;
  const scene = buildScene(seed, aspect, horizon);
  const noise = seededRandom(seed + 7);
  const step = Math.max(3, width / 150);

  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const { d, flag } = sample(x / width, y / height, scene, aspect);
      const darkness = Math.min(1, Math.max(0, d + (noise() - 0.5) * 0.06));
      const radius = step * 0.5 * Math.sqrt(darkness);
      if (radius < 0.35) continue;
      ctx.fillStyle = flag ? colors.flag : colors.dot;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
