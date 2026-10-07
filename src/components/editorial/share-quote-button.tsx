"use client";

import { ShareImageButton } from "./share-image-button";

interface ShareQuoteButtonProps {
  text: string;
  attribution: string;
  source?: string;
}

/** Compartilha a citação como imagem (gerada em /og/citacao) ou como texto. */
export function ShareQuoteButton({ text, attribution, source }: ShareQuoteButtonProps) {
  return (
    <ShareImageButton
      label="Compartilhar citação"
      fileName="citacao"
      shareText={`“${text}” (${attribution}${source ? `, ${source}` : ""})`}
      copyLabel="Copiar o texto"
      imageBase={`/og/citacao?${new URLSearchParams({
        texto: text,
        autor: attribution,
        ...(source ? { fonte: source } : {}),
      }).toString()}`}
    />
  );
}
