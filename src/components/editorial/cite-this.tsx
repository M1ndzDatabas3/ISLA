"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsClient } from "@/hooks/use-is-client";
import { siteConfig } from "@/site.config";
import {
  abntBook,
  abntOnlineArticle,
  bibtexBook,
  bibtexOnline,
  citationToText,
  type ArticleCitationInput,
  type BookCitationInput,
} from "@/lib/citation";

type CiteThisProps =
  | { kind: "book"; book: BookCitationInput }
  | { kind: "article"; article: Omit<ArticleCitationInput, "acesso" | "url"> & { path: string } };

function build(props: CiteThisProps, acesso: Date | null) {
  if (props.kind === "book") return { abnt: abntBook(props.book), bibtex: bibtexBook(props.book) };
  const input = { ...props.article, url: `${siteConfig.url}${props.article.path}`, acesso };
  return { abnt: abntOnlineArticle(input), bibtex: bibtexOnline(input) };
}

/**
 * "Como citar": ABNT e BibTeX, com botão de copiar. O endereço já vem completo
 * do servidor; a data de acesso é a do leitor, recalculada no momento da cópia.
 */
export function CiteThis(props: CiteThisProps) {
  const isClient = useIsClient();
  const { abnt, bibtex } = build(props, isClient ? new Date() : null);

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiada`);
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Selecione o texto e copie manualmente.",
      });
    }
  }

  return (
    <Tabs defaultValue="abnt" className="gap-5">
      <TabsList>
        <TabsTrigger value="abnt">ABNT</TabsTrigger>
        <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
      </TabsList>
      <TabsContent value="abnt" className="flex flex-col items-start gap-4">
        <p className="text-base leading-relaxed">
          {abnt.before}
          <strong className="font-semibold">{abnt.emphasis}</strong>
          {abnt.after}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(citationToText(build(props, new Date()).abnt), "Referência ABNT")}
        >
          <Copy aria-hidden strokeWidth={1.5} />
          Copiar ABNT
        </Button>
      </TabsContent>
      <TabsContent value="bibtex" className="flex flex-col items-start gap-4">
        <pre className="w-full overflow-x-auto border-l-2 border-brand bg-muted p-4 font-mono text-[0.8125rem] leading-relaxed">
          {bibtex}
        </pre>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(build(props, new Date()).bibtex, "Entrada BibTeX")}
        >
          <Copy aria-hidden strokeWidth={1.5} />
          Copiar BibTeX
        </Button>
      </TabsContent>
    </Tabs>
  );
}
