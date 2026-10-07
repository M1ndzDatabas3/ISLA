/**
 * Mega menu montado no servidor a partir do conteúdo: só entram categorias
 * com itens, cada uma com a contagem. O nome de cada seção (e o "Ver tudo")
 * leva à página-mestre: /artigos, /leituras, /explorar.
 */
import {
  categoriasDeArtigos,
  categoriasDeLivros,
  type GrupoDeCategorias,
} from "@/lib/content/facets";
import { getCapaDoMes } from "@/lib/mural";
import { sections, semEmBreve, type MegaMenuItem, type NavGroup } from "@/lib/navigation";

const paraGrupo = (g: GrupoDeCategorias, span?: 1 | 2): NavGroup => ({
  title: g.title,
  span,
  links: g.items.map((c) => ({ label: c.label, href: c.href, count: c.count })),
});

export function buildMegaMenu(): MegaMenuItem[] {
  const capa = getCapaDoMes();
  const artigos = categoriasDeArtigos().filter((g) => g.key !== "nivel");
  const livros = categoriasDeLivros();
  const livrosPor = (key: string) => livros.find((g) => g.key === key);

  const items: MegaMenuItem[] = [
    {
      label: "Artigos",
      href: sections.artigos.href,
      groups: artigos.map((g) => paraGrupo(g, g.items.length > 8 ? 2 : 1)),
      feature: {
        title: "Primeira leitura",
        text: "Textos de nível introdutório explicam os conceitos do zero, com exemplos e indicações de leitura.",
        href: "/artigos?nivel=introdutorio#todos",
        cta: "Ver artigos introdutórios",
      },
    },
    {
      label: "Leituras",
      href: sections.leituras.href,
      groups: [
        { title: "Onde ler", links: [sections.biblioteca, sections.acervo, sections.autores] },
        ...(["tipo", "nivel", "disponibilidade"] as const)
          .map((key) => livrosPor(key))
          .filter((g): g is GrupoDeCategorias => Boolean(g))
          .map((g) => paraGrupo(g)),
      ],
      feature: {
        title: "Por onde começar",
        text: "Livros de nível introdutório, que não exigem leitura prévia, com indicação do que ler em seguida.",
        href: "/biblioteca?nivel=introdutorio",
        cta: "Ver livros introdutórios",
      },
    },
    {
      label: "Explorar",
      href: sections.explorar.href,
      groups: [
        { title: "Estudar", links: [sections.trilhas, sections.glossario] },
        {
          title: "História e cultura",
          links: [
            sections.linhaDoTempo,
            sections.mapa,
            sections.debates,
            sections.podcast,
            sections.agenda,
          ],
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
      label: "Mural",
      href: sections.mural.href,
      groups: [
        {
          title: "Mural Cultural",
          links: [sections.muralArtistas, sections.muralObras, sections.muralChamada],
          span: 2,
        },
      ],
      feature: capa
        ? {
            title: "Capa do mês",
            text: `${capa.obra.titulo}, de ${capa.artista.nome}.`,
            href: `/mural/obras/${capa.obra.slug}`,
            cta: "Ver a obra",
            image: {
              src: capa.obra.imagens[0]!.src,
              alt: capa.obra.imagens[0]!.alt,
              width: capa.obra.imagens[0]!.largura,
              height: capa.obra.imagens[0]!.altura,
              blurDataURL: capa.obra.imagens[0]!.blurDataURL,
              credit: capa.artista.nome,
            },
          }
        : {
            title: "Chamada aberta",
            text: "O Mural está recebendo inscrições de artistas que fazem arte política e popular.",
            href: sections.muralChamada.href,
            cta: "Como participar",
          },
    },
    {
      label: "Instituto",
      href: sections.sobre.href,
      groups: [{ title: "O Instituto", links: [sections.sobre, sections.publique] }],
    },
  ];

  return items.map((item) => ({ ...item, groups: semEmBreve(item.groups) }));
}
