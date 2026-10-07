import Link from "next/link";

import { ShareQuoteButton } from "@/components/share/share-quote-button";
import type { FonteDoCard } from "@/lib/share/card-options";
import { cn } from "@/lib/utils";

import { ConferirNote } from "./conferir";

interface QuoteBlockProps {
  text: string;
  autor: string;
  /** Página do autor, quando ele está no acervo. */
  autorHref?: string;
  /** Obra e ano de origem. */
  fonte?: React.ReactNode;
  /** Aviso para revisão humana, ex.: "[CONFERIR tradução]". */
  nota?: string;
  /**
   * Card de compartilhamento: citação do acervo (`{ id }`) ou citação dentro de
   * um artigo (`{ artigo, texto }`), mais a página para onde o link leva.
   */
  share?: { fonte: FonteDoCard; caminho: string };
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
  share,
  compact,
  className,
}: QuoteBlockProps) {
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
      <figcaption data-share-ignore className="mt-5 text-meta text-muted-foreground">
        {autorHref ? (
          <Link href={autorHref} className="font-medium text-foreground hover:text-brand-text">
            {autor}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{autor}</span>
        )}
        {fonte ? <>, {fonte}</> : null}
        {nota ? (
          <>
            {" "}
            <ConferirNote nota={nota} />
          </>
        ) : null}
      </figcaption>
      {share ? (
        <div
          data-share-ignore
          className={cn(
            "mt-4",
            // No artigo, o botão aparece no hover (com mouse) e sempre no toque.
            compact &&
              "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-focus-within/quote:opacity-100 [@media(hover:hover)]:group-hover/quote:opacity-100",
          )}
        >
          <ShareQuoteButton
            fonte={share.fonte}
            texto={text}
            atribuicao={autor}
            caminho={share.caminho}
          />
        </div>
      ) : null}
    </div>
  );

  if (compact) {
    return (
      <figure data-quote-autor={autor} className={cn("group/quote m-0", className)}>
        {body}
      </figure>
    );
  }

  return (
    <figure data-quote-autor={autor} className={cn("group/quote m-0 grid-page", className)}>
      <div className="col-span-12 md:col-span-10 md:col-start-2">{body}</div>
    </figure>
  );
}
