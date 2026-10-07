import {
  areas,
  disponibilidades,
  filterParams,
  niveis,
  regioes,
  tiposDeArtigo,
  tiposDeObra,
  tradicoes,
} from "@/lib/taxonomy";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** Seção ainda em preparação: os menus mostram "em breve". */
  soon?: boolean;
}

export interface NavGroup {
  title: string;
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
    soon: true,
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

const toLinks = (base: string, param: string, list: readonly { slug: string; label: string }[]) =>
  list.map((t) => ({ label: t.label, href: `${base}?${param}=${t.slug}` }));

export const megaMenu: MegaMenuItem[] = [
  {
    label: "Artigos",
    href: sections.artigos.href,
    groups: [
      { title: "Por área", links: toLinks("/artigos", filterParams.area, areas) },
      {
        title: "Por tradição",
        links: toLinks("/artigos", filterParams.tradicao, tradicoes),
        span: 2,
      },
      { title: "Por região", links: toLinks("/artigos", filterParams.regiao, regioes) },
      {
        title: "Por formato",
        links: toLinks("/artigos", filterParams.tipoDeArtigo, tiposDeArtigo),
      },
    ],
    feature: {
      title: "Primeira leitura",
      text: "Textos de nível Introdutório explicam os conceitos do zero, com exemplos e indicações de leitura.",
      href: `/artigos?${filterParams.nivel}=introdutorio`,
      cta: "Ver artigos introdutórios",
    },
  },
  {
    label: "Leituras",
    href: sections.biblioteca.href,
    groups: [
      {
        title: "Onde ler",
        links: [sections.biblioteca, sections.acervo, sections.autores],
      },
      {
        title: "Tipo de obra",
        links: toLinks("/biblioteca", filterParams.tipoDeObra, tiposDeObra),
      },
      { title: "Nível de leitura", links: toLinks("/biblioteca", filterParams.nivel, niveis) },
      {
        title: "Disponibilidade",
        links: toLinks("/biblioteca", filterParams.disponibilidade, disponibilidades),
      },
    ],
    feature: {
      title: "Por onde começar",
      text: "Livros de nível introdutório, que não exigem leitura prévia, com indicação do que ler em seguida.",
      href: `/biblioteca?${filterParams.nivel}=introdutorio`,
      cta: "Ver livros introdutórios",
    },
  },
  {
    label: "Explorar",
    groups: [
      {
        title: "Estudar",
        links: [sections.trilhas, sections.glossario],
      },
      {
        title: "Ideias e história",
        links: [sections.mapa, sections.linhaDoTempo, sections.debates],
      },
      {
        title: "Cultura e mídia",
        links: [sections.cultura, sections.podcast, sections.agenda],
      },
    ],
    feature: {
      title: "Do Manifesto ao MST",
      text: "A linha do tempo reúne revoluções, fundações e rupturas, com atenção ao que aconteceu na América Latina.",
      href: sections.linhaDoTempo.href,
      cta: "Percorrer a linha do tempo",
    },
  },
  {
    label: "Instituto",
    href: sections.sobre.href,
    groups: [{ title: "O Instituto", links: [sections.sobre, sections.publique] }],
  },
];

/** Agrupamento usado no menu mobile e no footer. */
export const siteMap: NavGroup[] = [
  {
    title: "Leituras",
    links: [sections.biblioteca, sections.acervo, sections.artigos, sections.autores],
  },
  {
    title: "Explorar",
    links: [
      sections.trilhas,
      sections.glossario,
      sections.mapa,
      sections.linhaDoTempo,
      sections.debates,
    ],
  },
  { title: "Cultura e mídia", links: [sections.cultura, sections.podcast, sections.agenda] },
  { title: "Instituto", links: [sections.sobre, sections.publique, sections.privacidade] },
];

/** Atalhos da barra inferior no mobile. */
export const bottomNav = [
  { key: "inicio", label: "Início", href: "/" },
  { key: "biblioteca", label: "Leituras", href: sections.biblioteca.href },
  { key: "trilhas", label: "Trilhas", href: sections.trilhas.href },
  { key: "busca", label: "Busca", href: sections.busca.href },
] as const;
