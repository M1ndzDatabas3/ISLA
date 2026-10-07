"use client";

import { Link2, Share2 } from "lucide-react";

import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

interface ShareButtonsProps {
  title: string;
  /** Caminho da página (ex.: /biblioteca/o-capital-livro-1). */
  path: string;
  className?: string;
}

const redes = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    url: (u: string, t: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "x",
    label: "X",
    url: (u: string, t: string) =>
      `https://x.com/intent/post?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "bluesky",
    label: "Bluesky",
    url: (u: string, t: string) =>
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
];

/**
 * Compartilhar: folha do sistema no celular, redes e copiar link. Os links das
 * redes saem prontos do servidor (funcionam sem JavaScript).
 */
export function ShareButtons({ title, path, className }: ShareButtonsProps) {
  const url = `${siteConfig.url}${path}`;
  const fullUrl = () => url;

  async function nativeShare() {
    try {
      await navigator.share({ title, url: fullUrl() });
    } catch {
      // Cancelado pelo usuário.
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullUrl());
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  const item =
    "inline-flex h-10 items-center gap-2 border border-hair px-3 text-sm transition-colors hover:border-foreground";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button type="button" onClick={nativeShare} className={cn(item, "cursor-pointer sm:hidden")}>
        <Share2 className="size-4" strokeWidth={1.5} aria-hidden />
        Compartilhar
      </button>
      {redes.map((rede) => (
        <a
          key={rede.id}
          className={item}
          target="_blank"
          rel="noopener noreferrer"
          href={rede.url(url, title)}
        >
          {rede.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={cn(item, "cursor-pointer")}>
        <Link2 className="size-4" strokeWidth={1.5} aria-hidden />
        Copiar link
      </button>
    </div>
  );
}
