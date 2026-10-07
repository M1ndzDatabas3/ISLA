import type { MetadataRoute } from "next";

import { getArtigos, getAutores, getConceitos, getLivros } from "@/lib/content";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  // A busca é noindex; as demais seções entram com prioridade média.
  const secoes = Object.values(sections)
    .map((s) => s.href)
    .filter((href) => href !== sections.busca.href);

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
    ...getAutores().map((a) => ({
      url: url(`/autores/${a.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
