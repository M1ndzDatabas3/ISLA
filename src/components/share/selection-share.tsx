"use client";

import { Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { toast } from "@/components/ui/sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fragmentoDeTexto } from "@/lib/share/card-options";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import { QuoteShareDialog } from "./quote-share-dialog";

interface SelectionShareProps {
  /** Seletor do corpo do artigo: seleções fora dele são ignoradas. */
  alvo: string;
  artigo: string;
  titulo: string;
  assinatura: string;
}

type Selecao = {
  texto: string;
  /** Autor citado, quando a seleção está dentro de um bloco de citação. */
  autorCitado?: string;
  x: number;
  topo: number;
  base: number;
};

const letra = /[\p{L}\p{N}]/u;
/** Partes da página que não são texto do artigo (marcadas no HTML). */
const FORA_DO_TEXTO =
  "sup, [data-footnote-ref], .conferir-mark, [data-share-ignore], a[aria-label='Link para esta seção']";

/** Texto da seleção como o leitor o vê, com palavras inteiras nas pontas. */
function textoDaSelecao(range: Range) {
  const r = range.cloneRange();
  if (r.startContainer.nodeType === Node.TEXT_NODE) {
    const t = r.startContainer.textContent ?? "";
    let i = r.startOffset;
    while (i > 0 && letra.test(t[i - 1]!) && letra.test(t[i] ?? "")) i--;
    r.setStart(r.startContainer, i);
  }
  if (r.endContainer.nodeType === Node.TEXT_NODE) {
    const t = r.endContainer.textContent ?? "";
    let i = r.endOffset;
    while (i < t.length && letra.test(t[i]!) && letra.test(t[i - 1] ?? "")) i++;
    r.setEnd(r.endContainer, i);
  }
  const caixa = document.createElement("div");
  caixa.append(r.cloneContents());
  caixa.querySelectorAll(FORA_DO_TEXTO).forEach((n) => n.remove());
  // Parágrafos colados viram "fim.Início": um espaço entre blocos.
  caixa.querySelectorAll("p, li, h2, h3, h4, blockquote").forEach((b) => b.append(" "));
  return (caixa.textContent ?? "").replace(/\s+/g, " ").trim();
}

const elemento = (n: Node) => (n.nodeType === Node.ELEMENT_NODE ? (n as Element) : n.parentElement);

/**
 * Menu que aparece ao selecionar um trecho do artigo: "Compartilhar citação"
 * (abre o modal com o card) e "Copiar". No desktop flutua acima da seleção;
 * no celular é uma barra na base, porque o menu do sistema ocupa o alto.
 * Some ao rolar, ao clicar fora (a seleção some) e com seleção vazia.
 */
export function SelectionShare({ alvo, artigo, titulo, assinatura }: SelectionShareProps) {
  const [selecao, setSelecao] = useState<Selecao | null>(null);
  const [compartilhando, setCompartilhando] = useState<Selecao | null>(null);
  const [aberto, setAberto] = useState(false);
  const flutuante = useMediaQuery("(min-width: 768px) and (pointer: fine)", true);
  // No toque, a seleção pode sumir antes do clique chegar ao botão.
  const tocandoNoMenu = useRef(false);

  useEffect(() => {
    const raiz = document.querySelector(alvo);
    if (!raiz) return;
    let quadro = 0;

    const atualizar = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        if (tocandoNoMenu.current) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) return setSelecao(null);
        const range = sel.getRangeAt(0);
        const inicio = elemento(range.startContainer);
        const fim = elemento(range.endContainer);
        if (!inicio || !fim || !raiz.contains(inicio) || !raiz.contains(fim)) {
          return setSelecao(null);
        }
        if (inicio.closest("[data-footnotes]") || fim.closest("[data-footnotes]")) {
          return setSelecao(null);
        }
        const texto = textoDaSelecao(range);
        if (texto.length < 2) return setSelecao(null);
        const caixa = range.getBoundingClientRect();
        const citacao = inicio.closest("[data-quote-autor]");
        setSelecao({
          texto,
          autorCitado:
            citacao && citacao.contains(fim)
              ? (citacao.getAttribute("data-quote-autor") ?? undefined)
              : undefined,
          x: caixa.left + caixa.width / 2,
          topo: caixa.top,
          base: caixa.bottom,
        });
      });
    };
    const esconder = () => setSelecao(null);

    document.addEventListener("selectionchange", atualizar);
    window.addEventListener("scroll", esconder, { passive: true });
    window.addEventListener("resize", esconder);
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener("selectionchange", atualizar);
      window.removeEventListener("scroll", esconder);
      window.removeEventListener("resize", esconder);
    };
  }, [alvo]);

  const caminho = `/artigos/${artigo}`;
  const atribuicaoDe = (s: Selecao) => s.autorCitado ?? assinatura;

  async function copiar(s: Selecao) {
    const credito = s.autorCitado
      ? `${s.autorCitado}, citado em “${titulo}”`
      : `${assinatura}, “${titulo}”`;
    const link = `${siteConfig.url}${caminho}${fragmentoDeTexto(s.texto)}`;
    try {
      await navigator.clipboard.writeText(`“${s.texto}”\n${credito}\n${link}`);
      toast.success("Trecho copiado", { description: "Com o crédito e o link para o artigo." });
    } catch {
      toast.error("Não foi possível copiar", { description: "Use o atalho do sistema." });
    }
    setSelecao(null);
  }

  function compartilhar(s: Selecao) {
    setCompartilhando(s);
    setAberto(true);
    setSelecao(null);
  }

  const menu = selecao && !aberto ? selecao : null;
  // Abaixo do header fixo não cabe o menu acima da seleção: vai para baixo dela.
  const acima = menu ? menu.topo > 140 : true;

  return (
    <>
      {menu ? (
        <div
          role="toolbar"
          aria-label="Trecho selecionado"
          onPointerDown={(e) => {
            tocandoNoMenu.current = true;
            // Com o mouse, clicar no menu não desfaz a seleção.
            if (e.pointerType === "mouse") e.preventDefault();
          }}
          onPointerUp={() => setTimeout(() => (tocandoNoMenu.current = false), 400)}
          className={cn(
            "fixed z-40 flex bg-foreground text-background shadow-overlay",
            "animate-in duration-200 fade-in-0",
            flutuante
              ? acima
                ? "-translate-x-1/2 -translate-y-full"
                : "-translate-x-1/2"
              : "inset-x-4 justify-center",
          )}
          style={
            flutuante
              ? {
                  left: `clamp(150px, ${menu.x}px, calc(100vw - 150px))`,
                  top: acima ? menu.topo - 10 : menu.base + 10,
                }
              : { bottom: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + 12px)" }
          }
        >
          <button
            type="button"
            onClick={() => compartilhar(menu)}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap hover:bg-background/15"
          >
            <Share2 className="size-4" aria-hidden strokeWidth={1.5} />
            Compartilhar citação
          </button>
          <span aria-hidden className="my-2 w-px bg-background/25" />
          <button
            type="button"
            onClick={() => copiar(menu)}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap hover:bg-background/15"
          >
            <Copy className="size-4" aria-hidden strokeWidth={1.5} />
            Copiar
          </button>
        </div>
      ) : null}

      {compartilhando ? (
        <QuoteShareDialog
          open={aberto}
          onOpenChange={setAberto}
          fonte={{ artigo, texto: compartilhando.texto }}
          texto={compartilhando.texto}
          atribuicao={atribuicaoDe(compartilhando)}
          caminho={caminho}
        />
      ) : null}
    </>
  );
}
