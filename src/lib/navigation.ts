export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** Quantos itens a categoria tem (artigos, livros), mostrado no menu. */
  count?: number;
  /** Seção ainda em preparação: fica fora dos menus, do sitemap e da busca até abrir. */
  soon?: boolean;
}

export interface NavGroup {
  title: string;
  /** Página-mestre do grupo (rodapé e menu mobile ligam o título a ela). */
  href?: string;
  links: NavLink[];
  /** Quantas colunas o grupo ocupa no mega menu (listas longas ocupam 2). */
  span?: 1 | 2;
}

export interface MegaMenuItem {
  label: string;
  /** Página-índice do item; sem ela, o painel não mostra o "Ver tudo". */
  href?: string;
  groups: NavGroup[];
  /** Bloco de chamada à direita do mega menu. */
  feature?: { title: string; text: string; href: string; cta: string };
}

/** Todas as seções do site. Footer, menu mobile e páginas provisórias leem daqui. */
export const sections = {
  leituras: {
    label: "Leituras",
    href: "/leituras",
    description: "Biblioteca comentada e autores, com todas as categorias do acervo.",
  },
  explorar: {
    label: "Explorar",
    href: "/explorar",
    description: "Trilhas de estudo, glossário, linha do tempo e cultura.",
  },
  artigos: {
    label: "Artigos",
    href: "/artigos",
    description: "Ensaios, resenhas, traduções e entrevistas.",
  },
  biblioteca: {
    label: "Biblioteca",
    href: "/biblioteca",
    description: "Livros recomendados com filtros por tradição, área, região e nível.",
  },
  trilhas: {
    label: "Trilhas de estudo",
    href: "/trilhas",
    description: "Percursos guiados, do primeiro texto ao debate avançado.",
  },
  glossario: {
    label: "Glossário",
    href: "/glossario",
    description: "Conceitos de A a Z, com autores e textos onde aparecem.",
  },
  autores: {
    label: "Autores",
    href: "/autores",
    description: "Pensadoras e pensadores, suas obras e influências.",
  },
  acervo: {
    label: "Acervo",
    href: "/acervo",
    description: "Textos clássicos em domínio público, na íntegra.",
    soon: true,
  },
  mapa: {
    label: "Mapa de pensadores",
    href: "/mapa",
    description: "A rede de influências entre autores e tradições.",
    soon: true,
  },
  linhaDoTempo: {
    label: "Linha do tempo",
    href: "/linha-do-tempo",
    description: "Marcos históricos das lutas e das ideias socialistas.",
  },
  debates: {
    label: "Debates",
    href: "/debates",
    description: "Correntes em diálogo, polêmicas e críticas.",
    soon: true,
  },
  cultura: {
    label: "Cultura",
    href: "/cultura",
    description: "Cinema, música, literatura e artes visuais.",
  },
  podcast: {
    label: "Podcast e vídeos",
    href: "/podcast",
    description: "Episódios, entrevistas e aulas.",
    soon: true,
  },
  agenda: {
    label: "Agenda",
    href: "/agenda",
    description: "Eventos, cursos e lançamentos.",
    soon: true,
  },
  publique: {
    label: "Publique",
    href: "/publique",
    description: "Chamada aberta para estudantes e pesquisadores.",
    soon: true,
  },
  sobre: {
    label: "Sobre",
    href: "/sobre",
    description: "Quem somos, conselho editorial e linha editorial.",
  },
  busca: {
    label: "Busca",
    href: "/busca",
    description: "Procure em artigos, livros, autores e verbetes.",
  },
  privacidade: {
    label: "Privacidade",
    href: "/privacidade",
    description: "Como tratamos seus dados, conforme a LGPD.",
  },
} as const;

export type SectionKey = keyof typeof sections;

/** Tira dos menus as seções em preparação e os grupos que ficarem vazios. */
export function semEmBreve<T extends { links: NavLink[] }>(groups: T[]): T[] {
  return groups
    .map((g) => ({ ...g, links: g.links.filter((l) => !l.soon) }))
    .filter((g) => g.links.length > 0);
}

/** Agrupamento usado no menu mobile e no footer (sem as seções em preparação). */
export const siteMap: NavGroup[] = semEmBreve([
  {
    title: "Leituras",
    href: sections.leituras.href,
    links: [sections.biblioteca, sections.acervo, sections.artigos, sections.autores],
  },
  {
    title: "Explorar",
    href: sections.explorar.href,
    links: [
      sections.trilhas,
      sections.glossario,
      sections.linhaDoTempo,
      sections.cultura,
      sections.mapa,
      sections.debates,
      sections.podcast,
      sections.agenda,
    ],
  },
  {
    title: "Instituto",
    href: sections.sobre.href,
    links: [sections.sobre, sections.publique, sections.privacidade],
  },
]);

/** Atalhos da barra inferior no mobile. */
export const bottomNav = [
  { key: "inicio", label: "Início", href: "/" },
  { key: "leituras", label: "Leituras", href: sections.leituras.href },
  { key: "trilhas", label: "Trilhas", href: sections.trilhas.href },
  { key: "busca", label: "Busca", href: sections.busca.href },
] as const;
