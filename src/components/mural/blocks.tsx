/** Blocos das páginas do Mural: clássicos, cartazes, exposição em destaque e chamadas. */
import { Download } from "lucide-react";
import Link from "next/link";

import { BookCover, type Glyph, type Scheme } from "@/components/editorial/book-cover";
import { Button } from "@/components/ui/button";
import { ExampleBadge } from "@/components/ui/example-badge";
import { formatLongDate } from "@/lib/format";
import { labelOf, type LinguagemClassica } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

import { LicenseBadge, Passepartout, type ImagemDaObra } from "./artwork";

const posterPorLinguagem: Record<LinguagemClassica, { scheme: Scheme; glyph: Glyph }> = {
  filme: { scheme: "ink", glyph: "diagonal" },
  cancao: { scheme: "red", glyph: "anel" },
  romance: { scheme: "paper", glyph: "linha" },
  poesia: { scheme: "paper", glyph: "anel" },
  gravura: { scheme: "ink", glyph: "quadrado" },
  pintura: { scheme: "red", glyph: "quadrado" },
  cartaz: { scheme: "red", glyph: "cunha" },
  teatro: { scheme: "ink", glyph: "disco" },
};

/** Pôster tipográfico de um clássico (sem imagem licenciada, não usamos fotos de terceiros). */
export function ClassicPoster({
  slug,
  titulo,
  autoria,
  ano,
  linguagem,
  className,
}: {
  slug: string;
  titulo: string;
  autoria: string;
  ano: number;
  linguagem: LinguagemClassica;
  className?: string;
}) {
  return (
    <BookCover
      titulo={titulo}
      autor={autoria}
      ano={ano}
      seed={slug}
      {...posterPorLinguagem[linguagem]}
      className={className}
    />
  );
}

export interface ClassicCardData {
  slug: string;
  titulo: string;
  autoria: string;
  ano: number;
  pais: string;
  linguagem: LinguagemClassica;
}

export function ClassicCard({ classico }: { classico: ClassicCardData }) {
  return (
    <article className="group relative flex flex-col">
      <ClassicPoster
        {...classico}
        className="transition-transform duration-500 ease-poster group-hover:-translate-y-1.5"
      />
      <p className="mt-4 text-meta text-muted-foreground">
        {labelOf("linguagemClassica", classico.linguagem)}, {classico.pais}
      </p>
      <h3 className="mt-1 font-display text-[1.25rem] leading-tight transition-colors group-hover:text-brand-text">
        <Link
          href={`/mural/classicos/${classico.slug}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {classico.titulo}
        </Link>
      </h3>
      <p className="mt-1 text-meta text-muted-foreground">
        {classico.autoria}, {classico.ano}
      </p>
    </article>
  );
}

export interface PosterCardData {
  slug: string;
  titulo: string;
  artista: string;
  artistaHref: string;
  imagem: ImagemDaObra;
  licenca: Parameters<typeof LicenseBadge>[0]["licenca"];
  download: string;
  tamanho?: string | null;
  formato?: string;
  observacao?: string;
  demo?: boolean;
}

/** Cartaz liberado para baixar: obra inteira, crédito, licença e download com instrução de impressão. */
export function PosterCard({ poster, compact }: { poster: PosterCardData; compact?: boolean }) {
  return (
    <article className="flex flex-col">
      <Link href={`/mural/obras/${poster.slug}`} className="group block overflow-hidden">
        <Passepartout
          imagem={poster.imagem}
          ratio="aspect-[3/4]"
          sizes="(min-width: 1024px) 25vw, 50vw"
          imageClassName="transition-transform duration-700 ease-poster group-hover:scale-[1.03]"
        />
      </Link>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
        <Link href={poster.artistaHref} className="hover:text-brand-text">
          {poster.artista}
        </Link>
        {poster.demo ? <ExampleBadge /> : null}
      </p>
      <h3 className="mt-0.5 font-display text-[1.25rem] leading-tight italic">
        <Link href={`/mural/obras/${poster.slug}`} className="hover:text-brand-text">
          {poster.titulo}
        </Link>
      </h3>
      <LicenseBadge licenca={poster.licenca} className="mt-3" />
      {!compact && poster.formato ? (
        <p className="mt-2 text-meta text-muted-foreground">
          Impressão: {poster.formato}.{poster.observacao ? ` ${poster.observacao}` : ""}
        </p>
      ) : null}
      <Button asChild variant="outline" size="sm" className="mt-4 self-start">
        <a href={poster.download} download>
          <Download aria-hidden strokeWidth={1.5} />
          Baixar{poster.tamanho ? ` (${poster.tamanho})` : ""}
        </a>
      </Button>
    </article>
  );
}

/** Exposição em destaque: capa larga, título, curadoria e período. */
export function ExhibitionFeature({
  href,
  titulo,
  subtitulo,
  curadoria,
  inicio,
  fim,
  capa,
  resumo,
  demo,
}: {
  href: string;
  titulo: string;
  subtitulo?: string;
  curadoria: string[];
  inicio: string;
  fim?: string;
  capa?: ImagemDaObra;
  resumo?: string;
  demo?: boolean;
}) {
  return (
    <article className="group relative grid-page items-center gap-y-8">
      <div className="col-span-12 overflow-hidden lg:col-span-7">
        {capa ? (
          <Passepartout
            imagem={capa}
            ratio="aspect-[16/10]"
            sizes="(min-width: 1024px) 58vw, 100vw"
            imageClassName="transition-transform duration-700 ease-poster group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="col-span-12 flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
        <p className="flex flex-wrap items-center gap-2 text-meta text-muted-foreground">
          {formatLongDate(inicio)}
          {fim ? ` a ${formatLongDate(fim)}` : ""}
          {demo ? <ExampleBadge /> : null}
        </p>
        <h3 className="font-display text-h2 transition-colors group-hover:text-brand-text">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {titulo}
          </Link>
        </h3>
        {subtitulo ? <p className="text-lead text-muted-foreground">{subtitulo}</p> : null}
        {resumo ? <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed">{resumo}</p> : null}
        <p className="text-meta text-muted-foreground">Curadoria: {curadoria.join(", ")}</p>
        <span className="link-underline mt-2 self-start text-sm font-medium">
          Visitar a exposição
        </span>
      </div>
    </article>
  );
}

/** Chamada para artistas, em faixa vermelha. */
export function MuralCallout({ className }: { className?: string }) {
  return (
    <section aria-labelledby="chamada-titulo" className={cn("tone-red py-section", className)}>
      <div className="container-page grid-page items-end gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <h2 id="chamada-titulo" className="font-display text-h1">
            Sua obra no Mural
          </h2>
          <p className="mt-6 max-w-[48ch] text-lead">
            Artistas que fazem arte política e popular podem se inscrever a qualquer momento. O
            crédito é sempre seu, e é você quem escolhe a licença de cada obra.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
          <Button asChild size="lg">
            <Link href="/mural/chamada-aberta">Quero participar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
