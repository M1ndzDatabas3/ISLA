"use client";

import { Share2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { FonteDoCard } from "@/lib/share/card-options";
import { cn } from "@/lib/utils";

import { QuoteShareDialog } from "./quote-share-dialog";

interface ShareQuoteButtonProps {
  fonte: FonteDoCard;
  texto: string;
  atribuicao: string;
  caminho: string;
  /** "icone": só o ícone (faixa de citações da home). */
  aparencia?: "link" | "icone";
  /** -1 na cópia da faixa em loop, que fica fora do Tab. */
  tabIndex?: number;
  className?: string;
}

/** Botão "Compartilhar citação": abre o modal com o card (/og/citacao). */
export function ShareQuoteButton({
  aparencia = "link",
  tabIndex,
  className,
  ...dados
}: ShareQuoteButtonProps) {
  const [aberto, setAberto] = useState(false);
  // O modal só monta no primeiro clique e fica montado para a animação de saída.
  const [montado, setMontado] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);

  const abrir = () => {
    setMontado(true);
    setAberto(true);
  };

  return (
    <>
      {aparencia === "icone" ? (
        <button
          ref={botao}
          type="button"
          onClick={abrir}
          tabIndex={tabIndex}
          aria-label={`Compartilhar citação de ${dados.atribuicao}`}
          className={cn(
            "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-brand-text",
            className,
          )}
        >
          <Share2 className="size-4" aria-hidden strokeWidth={1.5} />
        </button>
      ) : (
        <Button
          ref={botao}
          type="button"
          variant="link"
          onClick={abrir}
          className={cn("text-sm", className)}
        >
          <Share2 aria-hidden strokeWidth={1.5} />
          Compartilhar citação
        </Button>
      )}
      {montado ? (
        <QuoteShareDialog {...dados} open={aberto} onOpenChange={setAberto} gatilho={botao} />
      ) : null}
    </>
  );
}
