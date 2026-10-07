"use client";

import { Copy, Image as ImageIcon, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";

interface ShareQuoteButtonProps {
  text: string;
  attribution: string;
  source?: string;
}

const formatos = [
  { id: "quadrado", label: "Imagem quadrada", detalhe: "Instagram e feeds" },
  { id: "story", label: "Imagem vertical", detalhe: "Stories, 9:16" },
  { id: "horizontal", label: "Imagem horizontal", detalhe: "X, Bluesky e links" },
] as const;

/**
 * Compartilha a citação como imagem (gerada em /og/citacao) ou como texto.
 * No celular usa a folha de compartilhamento do sistema, com o arquivo.
 */
export function ShareQuoteButton({ text, attribution, source }: ShareQuoteButtonProps) {
  const payload = `“${text}” (${attribution}${source ? `, ${source}` : ""})`;

  function imageUrl(formato: string) {
    const params = new URLSearchParams({ texto: text, autor: attribution, formato });
    if (source) params.set("fonte", source);
    return `/og/citacao?${params.toString()}`;
  }

  async function shareImage(formato: string) {
    const url = imageUrl(formato);
    try {
      if (navigator.canShare) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], `citacao-${formato}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: payload });
          return;
        }
      }
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return;
    }
    window.open(url, "_blank", "noopener");
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(`${payload}\n${window.location.href}`);
      toast.success("Citação copiada", { description: "Cole onde quiser compartilhar." });
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Selecione o texto e copie manualmente.",
      });
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="link" className="text-sm">
          <Share2 aria-hidden strokeWidth={1.5} />
          Compartilhar citação
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <ul className="flex flex-col">
          {formatos.map((formato) => (
            <li key={formato.id}>
              <PopoverClose asChild>
                <button
                  type="button"
                  onClick={() => shareImage(formato.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left hover:bg-accent"
                >
                  <ImageIcon className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                  <span>
                    <span className="block text-sm font-medium">{formato.label}</span>
                    <span className="block text-meta text-muted-foreground">{formato.detalhe}</span>
                  </span>
                </button>
              </PopoverClose>
            </li>
          ))}
          <li className="mt-1 border-t border-hair pt-1">
            <PopoverClose asChild>
              <button
                type="button"
                onClick={copyText}
                className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent"
              >
                <Copy className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                Copiar o texto
              </button>
            </PopoverClose>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
