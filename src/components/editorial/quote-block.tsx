import Link from "next/link";

import { cn } from "@/lib/utils";

import { ShareQuoteButton } from "./share-quote-button";

interface QuoteBlockProps {
  text: string;
  autor: string;
  /** Página do autor, quando ele está no acervo. */
  autorHref?: string;
  /** Obra e ano de origem. */
  fonte?: React.ReactNode;
  /** Aviso para revisão humana, ex.: "[CONFERIR tradução]". */
  nota?: string;
  shareable?: boolean;
  /** Versão para dentro do texto de um artigo (sem o deslocamento do grid). */
  compact?: boolean;
  className?: string;
}

/** Citação editorial: Archivo semicondensada em itálico, filete vermelho à esquerda. */
export function QuoteBlock({
  text,
  autor,
  autorHref,
  fonte,
  nota,
  shareable = true,
  compact,
  className,
}: QuoteBlockProps) {
  const fonteTexto = typeof fonte === "string" ? fonte : undefined;
  const body = (
    <div className={cn("border-l-2 border-brand", compact ? "pl-6" : "pl-6 md:pl-10")}>
      <blockquote className="m-0 border-0 p-0">
        <p
          className={cn(
            "font-display font-medium italic",
            compact ? "text-[1.5rem] leading-[1.25]" : "text-quote",
          )}
        >
          {text}
        </p>
      </blockquote>
      <figcaption className="mt-5 text-meta text-muted-foreground">
        {autorHref ? (
          <Link href={autorHref} className="font-medium text-foreground hover:text-brand-text">
            {autor}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{autor}</span>
        )}
        {fonte ? <>, {fonte}</> : null}
        {nota ? <span className="ml-1 text-brand-text">{nota}</span> : null}
      </figcaption>
      {shareable ? (
        <div className="mt-4">
          <ShareQuoteButton text={text} attribution={autor} source={fonteTexto} />
        </div>
      ) : null}
    </div>
  );

  if (compact) return <figure className={cn("m-0", className)}>{body}</figure>;

  return (
    <figure className={cn("m-0 grid-page", className)}>
      <div className="col-span-12 md:col-span-10 md:col-start-2">{body}</div>
    </figure>
  );
}
