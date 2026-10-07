/** Versões enxutas dos documentos do Mural para os componentes (inclusive de cliente). */
import type { ArtistListItem } from "@/components/mural/artists-explorer";
import type { Sala } from "@/components/mural/exhibition-wall";
import type { LightboxItem } from "@/components/mural/lightbox";
import { labelOf } from "@/lib/taxonomy";

import { getArtista, localDoArtista, obraDeCapa, type Artista, type Obra } from "./index";
import { regiaoDoArtista } from "./regioes";

export const hrefDoArtista = (slug: string) => `/mural/artistas/${slug}`;
export const hrefDaObra = (slug: string) => `/mural/obras/${slug}`;

export function toArtistListItem(a: Artista): ArtistListItem {
  return {
    slug: a.slug,
    href: hrefDoArtista(a.slug),
    nome: a.nome,
    local: localDoArtista(a),
    linguagens: a.linguagens.map((l) => labelOf("linguagem", l)),
    capa: obraDeCapa(a.slug)?.imagens[0],
    demo: a.demo,
    linguagemSlugs: a.linguagens,
    regiao: regiaoDoArtista(a),
    temaSlugs: a.temas,
    publicadoEm: a.publicadoEm ?? "",
  };
}

export function toLightboxItem(o: Obra): LightboxItem {
  const artista = getArtista(o.artista);
  return {
    id: o.slug,
    imagem: o.imagens[0]!,
    titulo: o.titulo,
    artista: artista?.nome ?? o.artista,
    artistaHref: hrefDoArtista(o.artista),
    ano: o.ano,
    href: hrefDaObra(o.slug),
    zoomSrc: o.arquivoParaDownload ?? undefined,
    demo: o.demo,
  };
}

export function toSala(o: Obra): Sala {
  const artista = getArtista(o.artista);
  return {
    id: o.slug,
    imagem: o.imagens[0]!,
    titulo: o.titulo,
    href: hrefDaObra(o.slug),
    artista: artista?.nome ?? o.artista,
    artistaHref: hrefDoArtista(o.artista),
    ano: o.ano,
    tecnica: o.tecnica,
    dimensoes: o.dimensoes,
    descricao: o.descricao,
    demo: o.demo,
  };
}
