import manifest from "@/components/brand/brand-manifest.json";

export type LogoVariant = "horizontal" | "simbolo" | "vertical";
export type LogoFileTone = "color" | "light" | "dark";

export interface BrandFile {
  /** Caminho público, ex.: /brand/logo-horizontal.png */
  src: string;
  width?: number;
  height?: number;
  type: string;
}

type ManifestEntry = { file: string; width?: number; height?: number; version?: string };
const files: Record<string, ManifestEntry | undefined> = manifest.files;

const mime: Record<string, string> = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg" };

function toBrandFile(entry: ManifestEntry): BrandFile {
  const ext = entry.file.split(".").pop() ?? "";
  return {
    src: `/brand/${entry.file}`,
    width: entry.width,
    height: entry.height,
    type: mime[ext] ?? "image/png",
  };
}

/** Arquivo oficial da marca pela chave do manifesto (ex.: "favicon", "logo-horizontal-light"). */
export function brandFile(key: string): BrandFile | null {
  const entry = files[key];
  return entry ? toBrandFile(entry) : null;
}

export function hasBrandFile(key: string): boolean {
  return Boolean(files[key]);
}

const logoKey = (variant: LogoVariant, tone: LogoFileTone) =>
  `logo-${variant}${tone === "color" ? "" : `-${tone}`}`;

/**
 * Arquivo oficial da logo, ou null se a variação ainda não existe.
 * Se faltar só o tom pedido, usa a versão `color` da mesma variação.
 */
export function officialLogo(variant: LogoVariant, tone: LogoFileTone): BrandFile | null {
  return brandFile(logoKey(variant, tone)) ?? brandFile(logoKey(variant, "color"));
}

/** Arquivo da marca com `?v=` do hash do conteúdo, para URLs que o navegador guarda em cache (ícones). */
function versionedBrandFile(key: string): BrandFile | null {
  const file = brandFile(key);
  const version = files[key]?.version;
  return file && version ? { ...file, src: `${file.src}?v=${version}` } : file;
}

/** Ícones e imagem OG padrão: arquivo oficial quando existe, senão a versão gerada. */
export const brandIcons = {
  favicon: versionedBrandFile("favicon") ?? { src: "/api/brand/favicon", type: "image/svg+xml" },
  appleTouch: versionedBrandFile("apple-touch-icon") ?? {
    src: "/api/brand/apple-icon",
    type: "image/png",
  },
  icon512: versionedBrandFile("icon-512") ?? { src: "/api/brand/icon-512", type: "image/png" },
  ogDefault: brandFile("og-default") ?? { src: "/api/brand/og", type: "image/png" },
} satisfies Record<string, BrandFile>;
