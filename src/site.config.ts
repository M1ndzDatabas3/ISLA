/**
 * Configuração central do site. Header, footer, metadados, cards OG e e-mails
 * leem daqui; nenhum componente deve escrever o nome do instituto à mão.
 */

export type SocialNetwork =
  "instagram" | "x" | "bluesky" | "youtube" | "spotify" | "telegram" | "whatsapp" | "mastodon";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  /** Deixe vazio até a conta existir; links vazios não são exibidos. */
  href: string;
}

/**
 * URL pública do site, usada em canonical, og:image, sitemap e referências ABNT.
 * Ordem: NEXT_PUBLIC_SITE_URL (domínio próprio, configure na Vercel) →
 * domínio de produção que a Vercel expõe sozinha → localhost em desenvolvimento.
 * Só variáveis NEXT_PUBLIC_*: o valor é o mesmo no servidor e no navegador.
 */
const vercelProduction = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteConfig = {
  name: "Instituto Socialista Latino-Americano",
  /** Usado onde o nome completo não cabe (aba do navegador, PWA). */
  shortName: "Instituto Socialista",
  description:
    "Biblioteca comentada, trilhas de estudo, glossário e textos clássicos do pensamento socialista, com atenção especial à América Latina e ao Brasil.",
  /** Manifesto do hero e do card OG padrão, uma frase por linha. */
  manifesto: ["Ler o mundo.", "Organizar a luta.", "Transformar a história."],
  /** Subtítulo do hero: quem somos em uma frase. */
  mission:
    "Um instituto de formação socialista pensado a partir da periferia do capitalismo: Brasil, América Latina e o Sul Global.",
  url: siteUrl,
  locale: "pt-BR",
  ogLocale: "pt_BR",
  /** TODO: definir o e-mail institucional. */
  contactEmail: "",
  editorialLine:
    "Publicamos estudos rigorosos, de diferentes correntes do pensamento socialista, com fontes verificáveis e linguagem acessível. Dados incertos são sinalizados até a revisão humana.",
  social: [
    { network: "instagram", label: "Instagram", href: "" },
    { network: "youtube", label: "YouTube", href: "" },
    { network: "bluesky", label: "Bluesky", href: "" },
    { network: "x", label: "X", href: "" },
    { network: "telegram", label: "Telegram", href: "" },
    { network: "spotify", label: "Spotify", href: "" },
  ] satisfies SocialLink[],
} as const;

export const activeSocialLinks = siteConfig.social.filter((link) => link.href.length > 0);

export type SiteConfig = typeof siteConfig;
