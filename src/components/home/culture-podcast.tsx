import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { getEpisodios, getObrasCulturais } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { sections } from "@/lib/navigation";

const tiposDeObra: Record<string, string> = {
  filme: "Filme",
  musica: "Música",
  literatura: "Literatura",
  "artes-visuais": "Artes visuais",
};

/**
 * Cultura: filmes, canções e romances comentados. Episódios de podcast só
 * aparecem quando forem reais (os de exemplo ficam fora da home).
 */
export function CulturePodcast() {
  const obras = getObrasCulturais().slice(0, 6);
  const episodios = getEpisodios()
    .filter((ep) => !ep.exemplo)
    .slice(0, 3);
  if (!obras.length && !episodios.length) return null;

  return (
    <>
      {obras.length ? (
        <Section tone="paper" divider aria-labelledby="cultura-titulo">
          <SectionHeading
            id="cultura-titulo"
            title="Cultura"
            description="Filmes, canções e romances que ajudam a entender a luta de classes na América Latina."
            action={{ label: "Todas as obras", href: sections.cultura.href }}
          />
          <ul className="grid gap-x-[clamp(16px,2vw,32px)] sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <li key={obra.slug} className="border-t border-hair pt-5 pb-stack">
                <p className="flex items-baseline justify-between gap-4 text-meta text-muted-foreground">
                  <span>{tiposDeObra[obra.tipo] ?? obra.tipo}</span>
                  <span className="tabular-nums">
                    {obra.pais}, {obra.ano}
                  </span>
                </p>
                <h3 className="mt-3 font-display text-h3">{obra.titulo}</h3>
                <p className="mt-1 text-sm">{obra.autoria}</p>
                <p className="mt-3 line-clamp-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {obra.resumo}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {episodios.length ? (
        <Section tone="paper" divider aria-labelledby="podcast-titulo">
          <SectionHeading id="podcast-titulo" title="Podcast e vídeos" />
          <ol className="grid gap-x-[clamp(16px,2vw,32px)] md:grid-cols-3">
            {episodios.map((ep) => (
              <li key={ep.slug} className="border-t border-hair pt-5">
                <p className="text-meta text-muted-foreground">
                  Episódio {ep.numero}, {ep.formato === "video" ? "vídeo" : "podcast"},{" "}
                  {ep.duracaoMin} min
                </p>
                <h3 className="mt-2 font-display text-h3">{ep.titulo}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{ep.resumo}</p>
                <p className="mt-2 text-meta text-muted-foreground">
                  <time dateTime={ep.data}>{formatDate(ep.data)}</time>
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
    </>
  );
}
