import { getArtigos, getAutores, getConceitos, getLivros, nomesDosAutores } from "@/lib/content";
import { joinNames } from "@/lib/content/summaries";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";

import type { SearchDoc } from "./types";

/** Monta o índice de busca a partir do conteúdo (roda no build). */
export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const a of getArtigos()) {
    docs.push({
      id: `artigo:${a.slug}`,
      type: "artigo",
      title: a.titulo,
      subtitle: `${labelOf("tipoDeArtigo", a.tipo)}, ${a.leituraMin} min`,
      href: `/artigos/${a.slug}`,
      keywords: [
        a.linhaFina,
        ...a.tradicoes.map((t) => labelOf("tradicao", t)),
        ...a.areas.map((t) => labelOf("area", t)),
      ].join(" "),
    });
  }
  for (const l of getLivros()) {
    docs.push({
      id: `livro:${l.slug}`,
      type: "livro",
      title: l.tituloCapa ?? l.titulo,
      subtitle: `${joinNames(nomesDosAutores(l))}, ${l.ano}`,
      href: `/biblioteca/${l.slug}`,
      keywords: [
        l.titulo,
        l.tituloOriginal ?? "",
        l.sinopse,
        ...l.tradicoes.map((t) => labelOf("tradicao", t)),
      ].join(" "),
    });
  }
  for (const a of getAutores()) {
    docs.push({
      id: `autor:${a.slug}`,
      type: "autor",
      title: a.nome,
      subtitle: [a.nascimento ? `${a.nascimento}–${a.morte ?? ""}` : "", a.nacionalidade]
        .filter(Boolean)
        .join(", "),
      href: `/autores/${a.slug}`,
      keywords: [
        a.nomeCompleto ?? "",
        a.bioCurta,
        ...a.tradicoes.map((t) => labelOf("tradicao", t)),
      ].join(" "),
    });
  }
  for (const c of getConceitos()) {
    docs.push({
      id: `verbete:${c.slug}`,
      type: "verbete",
      title: c.termo,
      subtitle: "Glossário",
      href: `/glossario/${c.slug}`,
      keywords: c.definicaoCurta,
    });
  }
  for (const s of Object.values(sections)) {
    docs.push({
      id: `secao:${s.href}`,
      type: "secao",
      title: s.label,
      subtitle: s.description,
      href: s.href,
      keywords: "",
    });
  }
  return docs;
}
