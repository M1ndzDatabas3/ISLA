"use client";

import { Copy, Image as ImageIcon, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const formatosDeImagem = [
  { id: "quadrado", label: "Imagem quadrada", detalhe: "Instagram e feeds" },
  { id: "story", label: "Imagem vertical", detalhe: "Stories, 9:16" },
  { id: "horizontal", label: "Imagem horizontal", detalhe: "WhatsApp, X, Bluesky e links" },
] as const;

export type FormatoDeImagem = (typeof formatosDeImagem)[number]["id"];

interface ShareImageButtonProps {
  /** Texto do botão ("Compartilhar citação", "Compartilhar artista"…). */
  label: string;
  /** URL da imagem gerada; o botão acrescenta `formato=` (quadrado, story ou horizontal). */
  imageBase: string;
  /** Prefixo do nome do arquivo ("citacao", "artista-fulano"). */
  fileName: string;
  /** Texto que acompanha a imagem na folha de compartilhamento e na cópia. */
  shareText: string;
  copyLabel?: string;
  className?: string;
}

/**
 * Compartilha uma imagem gerada (1:1, 9:16 ou horizontal) pela folha do sistema
 * no celular, ou abre a imagem para baixar; também copia o texto com o link.
 */
export function ShareImageButton({
  label,
  imageBase,
  fileName,
  shareText,
  copyLabel = "Copiar o texto",
  className,
}: ShareImageButtonProps) {
  const imageUrl = (formato: FormatoDeImagem) =>
    `${imageBase}${imageBase.includes("?") ? "&" : "?"}formato=${formato}`;

  async function shareImage(formato: FormatoDeImagem) {
    const url = imageUrl(formato);
    try {
      if (navigator.canShare) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], `${fileName}-${formato}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText });
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
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      toast.success("Texto copiado", { description: "Cole onde quiser compartilhar." });
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Selecione o texto e copie manualmente.",
      });
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="link" className={cn("text-sm", className)}>
          <Share2 aria-hidden strokeWidth={1.5} />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <ul className="flex flex-col">
          {formatosDeImagem.map((formato) => (
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
                {copyLabel}
              </button>
            </PopoverClose>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
