"use client";

import { Copy, Download, Share2 } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  formatosDoCard,
  fragmentoDeTexto,
  LIMITE_DO_TRECHO,
  temasDoCard,
  urlDoCard,
  type FonteDoCard,
  type FormatoDoCard,
  type TemaDoCard,
} from "@/lib/share/card-options";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

export interface QuoteShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fonte: FonteDoCard;
  /** Texto como aparece na página (vai no link com destaque e na mensagem). */
  texto: string;
  atribuicao: string;
  /** Página de origem: o artigo ou a página do autor. */
  caminho: string;
  /** Recebe o foco de volta ao fechar (o modal não tem DialogTrigger). */
  gatilho?: React.RefObject<HTMLElement | null>;
}

type Resultado = { url: string; blob?: Blob; objectUrl?: string; erro?: string };

const descricao = "Escolha o formato e o tema. A imagem leva o crédito e o link de volta.";

/**
 * Compartilhar uma citação como imagem: prévia do card (/og/citacao), formato e
 * tema, e as ações Compartilhar (arquivo pela folha do sistema, ou o link),
 * Baixar imagem e Copiar link (com o trecho destacado ao abrir).
 * Modal no desktop, drawer no celular.
 */
export function QuoteShareDialog(props: QuoteShareDialogProps) {
  const desktop = useMediaQuery("(min-width: 768px)", true);
  const { open, onOpenChange, gatilho } = props;
  const devolverFoco = (event: Event) => {
    if (!gatilho?.current) return;
    event.preventDefault();
    gatilho.current.focus({ preventScroll: true });
  };

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl gap-6" onCloseAutoFocus={devolverFoco}>
          <div className="flex flex-col gap-1 pr-10">
            <DialogTitle>Compartilhar citação</DialogTitle>
            <DialogDescription className="text-sm">{descricao}</DialogDescription>
          </div>
          {open ? <Painel {...props} layout="modal" /> : null}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent onCloseAutoFocus={devolverFoco}>
        <DrawerHeader>
          <DrawerTitle>Compartilhar citação</DrawerTitle>
          <DrawerDescription>{descricao}</DrawerDescription>
        </DrawerHeader>
        {open ? <Painel {...props} layout="drawer" /> : null}
      </DrawerContent>
    </Drawer>
  );
}

function Painel({
  fonte,
  texto,
  atribuicao,
  caminho,
  layout,
}: QuoteShareDialogProps & { layout: "modal" | "drawer" }) {
  const [formato, setFormato] = useState<FormatoDoCard>("quadrado");
  const [tema, setTema] = useState<TemaDoCard>("papel");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const url = urlDoCard(fonte, formato, tema);
  // O limite é conferido aqui também, para não pedir uma imagem que a rota vai recusar.
  const excesso = "texto" in fonte && texto.length > LIMITE_DO_TRECHO;
  const atual = resultado?.url === url ? resultado : null;
  const carregando = !excesso && !atual;
  const pronto = atual?.blob && atual.objectUrl ? atual : null;
  const link = `${siteConfig.url}${caminho}${fragmentoDeTexto(texto)}`;
  const mensagem = `“${texto}” (${atribuicao})`;
  const nomeDoArquivo = `citacao-${formato}-${tema}.png`;

  useEffect(() => {
    if (excesso) return;
    const controle = new AbortController();
    fetch(url, { signal: controle.signal })
      .then(async (resposta) => {
        if (!resposta.ok) {
          const erro = (await resposta.text()) || "Não foi possível gerar a imagem.";
          setResultado({ url, erro });
          return;
        }
        const blob = await resposta.blob();
        setResultado({ url, blob, objectUrl: URL.createObjectURL(blob) });
      })
      .catch((erro: Error) => {
        if (erro.name === "AbortError") return;
        setResultado({ url, erro: "Sem conexão para gerar a imagem. Tente de novo." });
      });
    return () => controle.abort();
  }, [url, excesso]);

  // Libera a imagem anterior da memória quando outra a substitui.
  useEffect(() => {
    const objectUrl = resultado?.objectUrl;
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resultado]);

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado", { description: "Ao abrir, o navegador destaca o trecho." });
    } catch {
      toast.error("Não foi possível copiar", { description: link });
    }
  }

  async function compartilhar() {
    try {
      const arquivo = pronto?.blob
        ? new File([pronto.blob], nomeDoArquivo, { type: "image/png" })
        : null;
      if (arquivo && navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], text: `${mensagem}\n${link}` });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: atribuicao, text: mensagem, url: link });
        return;
      }
      await copiarLink();
    } catch (erro) {
      if ((erro as DOMException).name === "AbortError") return;
      await copiarLink();
    }
  }

  const formatoAtual = formatosDoCard.find((f) => f.id === formato)!;
  const previa = (
    <div
      aria-live="polite"
      aria-busy={carregando}
      className={cn(
        "flex items-center justify-center border border-hair bg-surface p-4",
        layout === "modal" ? "h-[min(62vh,540px)]" : "h-[38dvh]",
      )}
    >
      {excesso ? (
        <div className="max-w-[36ch] text-center">
          <p className="text-sm">
            O trecho tem <strong className="font-medium tabular-nums">{texto.length}</strong>{" "}
            caracteres; o limite é {LIMITE_DO_TRECHO}. Selecione um trecho menor.
          </p>
          <p className="mt-2 font-sans text-meta text-brand-text tabular-nums">
            {texto.length}/{LIMITE_DO_TRECHO}
          </p>
        </div>
      ) : atual?.erro ? (
        <p className="max-w-[36ch] text-center text-sm text-brand-text">{atual.erro}</p>
      ) : pronto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pronto.objectUrl}
          alt={`Prévia da imagem: ${mensagem}`}
          width={formatoAtual.largura}
          height={formatoAtual.altura}
          className="h-auto max-h-full w-auto max-w-full shadow-overlay"
        />
      ) : (
        <p className="text-sm text-muted-foreground">Gerando a imagem…</p>
      )}
    </div>
  );

  const controles = (
    <div className="flex flex-col gap-6">
      <Opcoes
        legenda="Formato"
        valor={formato}
        onChange={setFormato}
        opcoes={formatosDoCard.map((f) => ({
          id: f.id,
          label: f.label,
          rotuloAcessivel: `Formato ${f.label.toLowerCase()}: ${f.detalhe}, ${f.largura} por ${f.altura} pixels`,
          detalhe: f.detalhe,
        }))}
      />
      <Opcoes
        legenda="Tema"
        valor={tema}
        onChange={setTema}
        opcoes={temasDoCard.map((t) => ({
          id: t.id,
          label: t.label,
          rotuloAcessivel: `Tema ${t.label.toLowerCase()}`,
          amostra: t.amostra,
        }))}
      />
    </div>
  );

  const acoes = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button type="button" onClick={compartilhar} disabled={!pronto}>
        <Share2 aria-hidden strokeWidth={1.5} />
        Compartilhar
      </Button>
      {pronto ? (
        <Button asChild variant="outline">
          <a href={pronto.objectUrl} download={nomeDoArquivo}>
            <Download aria-hidden strokeWidth={1.5} />
            Baixar imagem
          </a>
        </Button>
      ) : (
        <Button type="button" variant="outline" disabled>
          <Download aria-hidden strokeWidth={1.5} />
          Baixar imagem
        </Button>
      )}
      <Button type="button" variant="link" onClick={copiarLink} className="text-sm">
        <Copy aria-hidden strokeWidth={1.5} />
        Copiar link
      </Button>
    </div>
  );

  if (layout === "drawer") {
    return (
      <>
        <DrawerBody className="flex flex-col gap-6">
          {previa}
          {controles}
        </DrawerBody>
        <DrawerFooter className="flex-wrap">{acoes}</DrawerFooter>
      </>
    );
  }
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
      {previa}
      <div className="flex flex-col justify-between gap-8">
        {controles}
        {acoes}
      </div>
    </div>
  );
}

interface Opcao<T extends string> {
  id: T;
  label: string;
  rotuloAcessivel: string;
  detalhe?: string;
  amostra?: string;
}

/** Grupo de rádio nativo (setas do teclado funcionam) com cara de botões. */
function Opcoes<T extends string>({
  legenda,
  valor,
  onChange,
  opcoes,
}: {
  legenda: string;
  valor: T;
  onChange: (valor: T) => void;
  opcoes: Opcao<T>[];
}) {
  const nome = useId();
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legenda}</legend>
      <div className="grid grid-cols-3 border-t border-l border-input">
        {opcoes.map((opcao) => {
          const ativo = opcao.id === valor;
          return (
            <label
              key={opcao.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center gap-2 border-r border-b border-input px-2 text-sm transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-ring",
                ativo ? "bg-foreground text-background" : "hover:bg-accent",
              )}
            >
              <input
                type="radio"
                name={nome}
                value={opcao.id}
                checked={ativo}
                onChange={() => onChange(opcao.id)}
                aria-label={opcao.rotuloAcessivel}
                className="sr-only"
              />
              {opcao.amostra ? (
                <span
                  aria-hidden
                  className="size-3 shrink-0 border border-current/40"
                  style={{ backgroundColor: opcao.amostra }}
                />
              ) : null}
              {opcao.label}
            </label>
          );
        })}
      </div>
      {opcoes.find((o) => o.id === valor)?.detalhe ? (
        <p className="mt-2 text-meta text-muted-foreground">
          {opcoes.find((o) => o.id === valor)!.detalhe}
        </p>
      ) : null}
    </fieldset>
  );
}
