import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";

import { QuoteBlock } from "@/components/editorial/quote-block";
import { getAutor, getConceito } from "@/lib/content";
import { cn } from "@/lib/utils";

import { GlossaryTerm } from "./glossary-term";

/** <Termo slug="mais-valia">mais-valia</Termo> no MDX. */
function Termo({ slug, children }: { slug: string; children: React.ReactNode }) {
  const conceito = getConceito(slug);
  if (!conceito) return <>{children}</>;
  return (
    <GlossaryTerm
      termo={conceito.termo}
      definicao={conceito.definicaoCurta}
      href={`/glossario/${slug}`}
    >
      {children}
    </GlossaryTerm>
  );
}

/** <Citacao autor="karl-marx" fonte="..." conferir="...">texto</Citacao> no MDX. */
function Citacao({
  autor,
  fonte,
  conferir,
  children,
}: {
  autor: string;
  fonte?: string;
  conferir?: string;
  children: React.ReactNode;
}) {
  const pessoa = getAutor(autor);
  const texto = typeof children === "string" ? children : extractText(children);
  return (
    <QuoteBlock
      text={texto}
      autor={pessoa?.nome ?? autor}
      autorHref={pessoa ? `/autores/${pessoa.slug}` : undefined}
      fonte={fonte}
      nota={conferir}
      className="not-prose my-12"
      compact
    />
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

function Anchor({ href = "", children, ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

/** Títulos com âncora: o link de seção aparece no hover e pode ser copiado. */
function heading(Tag: "h2" | "h3") {
  return function Heading({ id, children, className, ...props }: React.ComponentProps<"h2">) {
    return (
      <Tag
        id={id}
        className={cn("group scroll-mt-[calc(var(--header-h)+24px)]", className)}
        {...props}
      >
        {children}
        {id ? (
          <a
            href={`#${id}`}
            aria-label="Link para esta seção"
            className="ml-2 inline-block text-[0.7em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            #
          </a>
        ) : null}
      </Tag>
    );
  };
}

const components = {
  Termo,
  Citacao,
  a: Anchor,
  h2: heading("h2"),
  h3: heading("h3"),
};

export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
