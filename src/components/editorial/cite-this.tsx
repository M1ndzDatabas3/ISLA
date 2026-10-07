"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsClient } from "@/hooks/use-is-client";
import {
  abntBook,
  abntOnlineArticle,
  bibtexBook,
  bibtexOnline,
  citationToText,
  type ArticleCitationInput,
  type BookCitationInput,
  type CitationParts,
} from "@/lib/citation";

type CiteThisProps =
  | { kind: "book"; book: BookCitationInput }
  | { kind: "article"; article: Omit<ArticleCitationInput, "acesso" | "url"> & { path: string } };

/** "Como citar": ABNT e BibTeX, com botão de copiar. A data de acesso é a do leitor. */
export function CiteThis(props: CiteThisProps) {
  // Data de acesso e endereço só existem no navegador do leitor.
  const isClient = useIsClient();
  const acesso = isClient ? new Date() : null;
  const origin = isClient ? window.location.origin : "";

  let abnt: CitationParts;
  let bibtex: string;
  if (props.kind === "book") {
    abnt = abntBook(props.book);
    bibtex = bibtexBook(props.book);
  } else {
    const input = {
      ...props.article,
      url: `${origin}${props.article.path}`,
      acesso: acesso ?? new Date(`${props.article.data}T12:00:00Z`),
    };
    abnt = abntOnlineArticle(input);
    bibtex = bibtexOnline(input);
  }

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
          onClick={() => copy(citationToText(abnt), "Referência ABNT")}
        >
          <Copy aria-hidden strokeWidth={1.5} />
          Copiar ABNT
        </Button>
      </TabsContent>
      <TabsContent value="bibtex" className="flex flex-col items-start gap-4">
        <pre className="w-full overflow-x-auto border-l-2 border-brand bg-muted p-4 font-mono text-[0.8125rem] leading-relaxed">
          {bibtex}
        </pre>
        <Button variant="outline" size="sm" onClick={() => copy(bibtex, "Entrada BibTeX")}>
          <Copy aria-hidden strokeWidth={1.5} />
          Copiar BibTeX
        </Button>
      </TabsContent>
    </Tabs>
  );
}
