import Link from "next/link";

import { Section } from "@/components/layout/section";
import { ExampleBadge } from "@/components/ui/example-badge";
import { getEpisodios, getObrasCulturais } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { sections } from "@/lib/navigation";

const tiposDeObra: Record<string, string> = {
  filme: "Filme",
  musica: "Música",
  literatura: "Literatura",
  "artes-visuais": "Artes visuais",
};

/** Dois blocos lado a lado: obras de cultura comentadas e os episódios mais recentes. */
export function CulturePodcast() {
  const obras = getObrasCulturais().slice(0, 5);
  const episodios = getEpisodios().slice(0, 3);
  if (!obras.length && !episodios.length) return null;

  return (
    <Section tone="paper" divider>
      <div className="grid-page gap-y-section">
        {obras.length ? (
          <section aria-labelledby="cultura-titulo" className="col-span-12 lg:col-span-6">
            <ColumnHeading
              id="cultura-titulo"
              title="Cultura"
              href={sections.cultura.href}
              description="Filmes, canções e romances que ajudam a entender a luta de classes na América Latina."
            />
            <ul className="flex flex-col border-t border-hair">
              {obras.map((obra) => (
                <li
                  key={obra.slug}
                  className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-hair py-4"
                >
                  <p className="font-display text-[1.25rem] leading-tight">{obra.titulo}</p>
                  <p className="text-meta text-muted-foreground tabular-nums">{obra.ano}</p>
                  <p className="col-span-2 text-sm text-muted-foreground">
                    {tiposDeObra[obra.tipo] ?? obra.tipo}, {obra.autoria}, {obra.pais}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {episodios.length ? (
          <section
            aria-labelledby="podcast-titulo"
            className="col-span-12 lg:col-span-5 lg:col-start-8"
          >
            <ColumnHeading
              id="podcast-titulo"
              title="Podcast e vídeos"
              href={sections.podcast.href}
              description="Conversas e aulas sobre os autores, livros e debates do acervo."
            />
            <ol className="flex flex-col border-t border-hair">
              {episodios.map((ep) => (
                <li key={ep.slug} className="border-b border-hair py-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-muted-foreground">
                    <span className="tabular-nums">Episódio {ep.numero}</span>
                    <span>
                      {ep.formato === "video" ? "Vídeo" : "Podcast"}, {ep.duracaoMin} min
                    </span>
                    {ep.exemplo ? <ExampleBadge /> : null}
                  </div>
                  <h3 className="mt-2 font-display text-[1.25rem] leading-tight">{ep.titulo}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{ep.resumo}</p>
                  <p className="mt-2 text-meta text-muted-foreground">
                    <time dateTime={ep.data}>{formatDate(ep.data)}</time>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </Section>
  );
}

/** Título de coluna: mesma estrutura nas duas, para as listas começarem na mesma altura. */
function ColumnHeading({
  id,
  title,
  href,
  description,
}: {
  id: string;
  title: string;
  href: string;
  description: string;
}) {
  return (
    <div className="mb-section-head flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-6">
        <h2 id={id} className="font-display text-h2">
          {title}
        </h2>
        <Link href={href} className="link-underline shrink-0 text-sm font-medium">
          Ver tudo
        </Link>
      </div>
      <p className="max-w-[46ch] text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
