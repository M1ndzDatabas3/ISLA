import type { MetadataRoute } from "next";

import { getArtigos, getAutores, getConceitos, getLivros } from "@/lib/content";
import { getArtistas, getClassicos, getExposicoes, getObras } from "@/lib/mural";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  // A busca e as seções em preparação ("em breve") ficam fora dos buscadores.
  const secoes = Object.values(sections)
    .filter((s) => s.href !== sections.busca.href && !("soon" in s && s.soon))
    .map((s) => s.href);

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    ...secoes.map((href) => ({
      url: url(href),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getArtigos().map((a) => ({
      url: url(`/artigos/${a.slug}`),
      lastModified: a.data,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getLivros().map((l) => ({
      url: url(`/biblioteca/${l.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getConceitos().map((c) => ({
      url: url(`/glossario/${c.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getArtistas().map((a) => ({
      url: url(`/mural/artistas/${a.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getObras().map((o) => ({
      url: url(`/mural/obras/${o.slug}`),
      lastModified: o.publicadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getExposicoes().map((e) => ({
      url: url(`/mural/exposicoes/${e.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getClassicos().map((c) => ({
      url: url(`/mural/classicos/${c.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAutores().map((a) => ({
      url: url(`/autores/${a.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
