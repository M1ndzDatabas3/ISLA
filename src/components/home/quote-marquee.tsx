import Link from "next/link";

import { ShareQuoteButton } from "@/components/share/share-quote-button";
import { getAutor, getCitacoes } from "@/lib/content";

import { FEATURED_QUOTE } from "./featured-quote";
import { MarqueeTrack } from "./marquee-track";

/** Faixa contínua de citações curtas; cada uma leva à página de quem a escreveu. */
export function QuoteMarquee() {
  const citacoes = getCitacoes()
    // A citação em destaque tem seção própria na home.
    .filter((c) => c.slug !== FEATURED_QUOTE && c.texto.length <= 150)
    .map((c) => ({ ...c, pessoa: getAutor(c.autor) }))
    .filter((c) => c.pessoa);
  if (citacoes.length < 3) return null;

  // A segunda cópia só existe para o loop não ter emenda; fica fora da leitura e do Tab.
  const lista = (copia: boolean) => (
    <ul className="flex shrink-0" aria-hidden={copia || undefined}>
      {citacoes.map((c) => (
        <li key={c.slug} className="flex shrink-0 items-center">
          <Link
            href={`/autores/${c.pessoa!.slug}`}
            tabIndex={copia ? -1 : undefined}
            className="group/quote flex items-baseline gap-4 px-[clamp(20px,3vw,40px)] whitespace-nowrap"
          >
            <span className="font-display text-[clamp(1.25rem,1rem+1vw,1.875rem)] font-medium italic transition-colors group-hover/quote:text-brand-text">
              “{c.texto}”
            </span>
            <span className="text-sm text-muted-foreground">{c.pessoa!.nome}</span>
          </Link>
          <ShareQuoteButton
            aparencia="icone"
            fonte={{ id: c.slug }}
            texto={c.texto}
            atribuicao={c.pessoa!.nome}
            caminho={`/autores/${c.pessoa!.slug}`}
            tabIndex={copia ? -1 : undefined}
            className="mr-[clamp(8px,1.5vw,20px)] -ml-[clamp(12px,2vw,28px)]"
          />
          <span aria-hidden className="size-1.5 shrink-0 bg-red" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Citações" className="relative border-y border-hair py-section-head">
      <MarqueeTrack label="as citações">
        {lista(false)}
        {lista(true)}
      </MarqueeTrack>
    </section>
  );
}
