/**
 * Peças de exibição de obras do Mural. Regra: a obra é protagonista. Nada de
 * duotone, cor por cima ou corte: a imagem aparece inteira, na proporção
 * original (ou contida num passe-partout escuro, nos cards), e o crédito do
 * artista acompanha a imagem em todo lugar.
 */
import Image from "next/image";
import Link from "next/link";

import { ExampleBadge } from "@/components/ui/example-badge";
import { labelOf, urlDaLicenca, type Licenca } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export interface ImagemDaObra {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  blurDataURL: string;
  credito?: string;
}

/** Imagem na proporção original, com blur enquanto carrega. */
export function ArtworkImage({
  imagem,
  sizes,
  priority,
  className,
}: {
  imagem: ImagemDaObra;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={imagem.src}
      alt={imagem.alt}
      width={imagem.largura}
      height={imagem.altura}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={imagem.blurDataURL}
      className={cn("h-auto w-full", className)}
    />
  );
}

/** Obra inteira contida num passe-partout escuro de proporção fixa (cards e grades). */
export function Passepartout({
  imagem,
  sizes,
  ratio = "aspect-[4/5]",
  className,
  imageClassName,
}: {
  imagem: ImagemDaObra;
  sizes: string;
  ratio?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#161616]", ratio, className)}>
      <div className="absolute inset-[7%]">
        <Image
          src={imagem.src}
          alt={imagem.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={imagem.blurDataURL}
          className={cn("object-contain", imageClassName)}
        />
      </div>
    </div>
  );
}

/** Legenda de museu: artista, título e ano, técnica, dimensões e crédito da foto. */
export function MuseumCaption({
  artista,
  artistaHref,
  titulo,
  obraHref,
  ano,
  tecnica,
  dimensoes,
  credito,
  demo,
  className,
}: {
  artista: string;
  artistaHref?: string;
  titulo: string;
  obraHref?: string;
  ano?: number;
  tecnica?: string;
  dimensoes?: string;
  credito?: string;
  demo?: boolean;
  className?: string;
}) {
  return (
    <figcaption className={cn("flex flex-col gap-0.5 font-sans text-meta", className)}>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-foreground">
        {artistaHref ? (
          <Link href={artistaHref} className="relative z-10 hover:text-brand-text">
            {artista}
          </Link>
        ) : (
          artista
        )}
        {demo ? <ExampleBadge /> : null}
      </span>
      <span className="text-muted-foreground">
        {obraHref ? (
          <Link href={obraHref} className="relative z-10 italic hover:text-foreground">
            {titulo}
          </Link>
        ) : (
          <i>{titulo}</i>
        )}
        {ano ? `, ${ano}` : ""}
      </span>
      {tecnica || dimensoes ? (
        <span className="text-muted-foreground">
          {[tecnica, dimensoes].filter(Boolean).join(", ")}
        </span>
      ) : null}
      {credito ? <span className="text-muted-foreground">Foto: {credito}</span> : null}
    </figcaption>
  );
}

/** Card de obra para galerias: imagem inteira, zoom leve e nome do artista no hover. */
export function ArtworkCard({
  href,
  imagem,
  titulo,
  artista,
  artistaHref,
  ano,
  demo,
  sizes,
}: {
  href: string;
  imagem: ImagemDaObra;
  titulo: string;
  artista: string;
  artistaHref?: string;
  ano?: number;
  demo?: boolean;
  sizes: string;
}) {
  return (
    <figure className="group relative m-0">
      <div className="relative overflow-hidden bg-[#161616]">
        <div className="transition-transform duration-700 ease-poster group-hover:scale-[1.03]">
          <ArtworkImage imagem={imagem} sizes={sizes} />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink px-3 py-2 font-sans text-meta text-paper transition-transform duration-500 ease-poster group-focus-within:translate-y-0 group-hover:translate-y-0"
        >
          {artista}
        </span>
      </div>
      <Link
        href={href}
        className="absolute inset-0 z-[1]"
        aria-label={`${titulo}, de ${artista}`}
      />
      <MuseumCaption
        className="mt-3"
        artista={artista}
        artistaHref={artistaHref}
        titulo={titulo}
        ano={ano}
        demo={demo}
      />
    </figure>
  );
}

/** Licença da obra com o nome curto e o link para o texto da Creative Commons. */
export function LicenseBadge({ licenca, className }: { licenca: Licenca; className?: string }) {
  const url = urlDaLicenca[licenca];
  const label = labelOf("licenca", licenca);
  const cc = licenca.startsWith("cc-");
  const conteudo = (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-flex h-5 items-center rounded-full border px-1.5 font-sans text-[0.625rem] leading-none font-semibold tracking-wide",
          cc ? "border-foreground" : "border-muted-foreground text-muted-foreground",
        )}
      >
        {cc ? "CC" : "©"}
      </span>
      <span>{label}</span>
    </>
  );
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer license"
      className={cn("inline-flex items-center gap-2 text-sm hover:text-brand-text", className)}
    >
      {conteudo}
    </a>
  ) : (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>{conteudo}</span>
  );
}
