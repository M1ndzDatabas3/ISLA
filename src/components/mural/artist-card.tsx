import Link from "next/link";

import { ExampleBadge } from "@/components/ui/example-badge";
import { cn } from "@/lib/utils";

import { Passepartout, type ImagemDaObra } from "./artwork";

export interface ArtistCardData {
  slug: string;
  href: string;
  nome: string;
  local: string;
  linguagens: string[];
  capa?: ImagemDaObra;
  demo?: boolean;
}

/** Card de artista: obra de destaque inteira no passe-partout, nome, cidade e linguagens. */
export function ArtistCard({ artist, className }: { artist: ArtistCardData; className?: string }) {
  return (
    <article className={cn("group relative flex flex-col", className)}>
      {artist.capa ? (
        <div className="overflow-hidden">
          <Passepartout
            imagem={artist.capa}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            imageClassName="transition-transform duration-700 ease-poster group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <div aria-hidden className="flex aspect-[4/5] items-end bg-[#161616] p-5">
          <span className="font-display text-[2.5rem] leading-none text-paper/80">
            {artist.nome}
          </span>
        </div>
      )}
      <h3 className="mt-4 flex flex-wrap items-center gap-2 font-display text-h3 transition-colors group-hover:text-brand-text">
        <Link href={artist.href} className="after:absolute after:inset-0 after:content-['']">
          {artist.nome}
        </Link>
        {artist.demo ? <ExampleBadge className="relative z-10" /> : null}
      </h3>
      <p className="mt-1 text-meta text-muted-foreground">{artist.local}</p>
      <p className="mt-0.5 text-meta text-muted-foreground">{artist.linguagens.join(", ")}</p>
    </article>
  );
}
