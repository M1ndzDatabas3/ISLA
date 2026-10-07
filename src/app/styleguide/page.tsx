import type { Metadata } from "next";
import Link from "next/link";

import { Logo, type LogoTone } from "@/components/brand/Logo";
import { ArticleCard } from "@/components/editorial/article-card";
import { AuthorCard } from "@/components/editorial/author-card";
import { BookCard } from "@/components/editorial/book-card";
import { QuoteBlock } from "@/components/editorial/quote-block";
import { SectionHeading } from "@/components/editorial/section-heading";
import { HalftonePhoto } from "@/components/graphics/halftone-photo";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { LevelBadge } from "@/components/ui/level-badge";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasBrandFile } from "@/lib/brand";
import { contrastRatio, motion, palette, paletteDark } from "@/lib/tokens";
import { cn } from "@/lib/utils";

import { ChipToggleDemo, OverlayDemos } from "./_demos";
import { sampleArticles, sampleAuthors, sampleBooks } from "./_samples";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design system do Instituto Socialista Latino-Americano.",
  robots: { index: false, follow: false },
};

const index = [
  ["cores", "Cores"],
  ["tipografia", "Tipografia"],
  ["marca", "Marca"],
  ["botoes", "Botões"],
  ["chips", "Chips e nível"],
  ["artigos", "Artigos"],
  ["livros", "Livros"],
  ["autores", "Autores"],
  ["citacao", "Citação"],
  ["navegacao", "Navegação"],
  ["sobreposicoes", "Sobreposições"],
  ["imagens", "Imagens"],
  ["motion", "Motion"],
] as const;

const ratio = (fg: string, bg: string) => contrastRatio(fg, bg).toFixed(1).replace(".", ",");

const swatches = [
  {
    name: "Branco",
    token: "--paper",
    hex: palette.paper,
    fg: palette.ink,
    note: `preto sobre branco ${ratio(palette.ink, palette.paper)}:1`,
  },
  { name: "Preto", token: "--ink", hex: palette.ink, fg: palette.paper, note: "texto e controles" },
  {
    name: "Vermelho",
    token: "--red",
    hex: palette.red,
    fg: palette.paper,
    note: `acento; ${ratio(palette.red, palette.paper)}:1 como texto e com texto branco`,
  },
  {
    name: "Cinza",
    token: "--ink-muted",
    hex: palette.inkMuted,
    fg: palette.paper,
    note: `metadados, ${ratio(palette.inkMuted, palette.paper)}:1`,
  },
  {
    name: "Linha fina",
    token: "--hair",
    hex: palette.hair,
    fg: palette.ink,
    note: "separadores (decorativo)",
  },
];

const darkSwatches = [
  {
    name: "Fundo",
    hex: paletteDark.background,
    fg: paletteDark.foreground,
    note: `${ratio(paletteDark.foreground, paletteDark.background)}:1`,
  },
  {
    name: "Superfície",
    hex: paletteDark.surface,
    fg: paletteDark.foreground,
    note: `${ratio(paletteDark.foreground, paletteDark.surface)}:1`,
  },
  {
    name: "Cinza",
    hex: paletteDark.background,
    fg: paletteDark.muted,
    note: `${ratio(paletteDark.muted, paletteDark.background)}:1`,
  },
  {
    name: "Vermelho texto",
    hex: paletteDark.background,
    fg: paletteDark.redText,
    note: `${ratio(paletteDark.redText, paletteDark.background)}:1`,
  },
];

const typeScale = [
  { token: "text-hero", sample: "Ler o mundo", className: "font-display text-hero" },
  { token: "text-h1", sample: "Título de página", className: "font-display text-h1" },
  { token: "text-h2", sample: "Título de seção", className: "font-display text-h2" },
  { token: "text-h3", sample: "Título de card", className: "font-display text-h3" },
  {
    token: "text-quote",
    sample: "Citação em itálico leve",
    className: "font-display text-quote font-medium italic",
  },
  {
    token: "text-lead",
    sample: "Linha fina e textos de abertura",
    className: "font-text text-lead",
  },
  {
    token: "text-body",
    sample: "Corpo de leitura longa, de 17 a 20px",
    className: "font-text text-body",
  },
  {
    token: "text-meta",
    sample: "Metadados, datas, filtros",
    className: "font-sans text-meta text-muted-foreground",
  },
];

/** Fundos fixos (não mudam com o tema): a logo é testada sobre as cores absolutas. */
const logoBackgrounds: { label: string; className: string; logoTone: LogoTone }[] = [
  { label: "Branco", className: "bg-paper text-ink border border-[#d4d4d4]", logoTone: "color" },
  { label: "Preto", className: "bg-ink text-paper", logoTone: "light" },
  { label: "Vermelho", className: "bg-red text-paper", logoTone: "light" },
];

function Block({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Section id={id} tone="paper" className="scroll-mt-[var(--header-h)] border-t border-hair">
      <SectionHeading title={title} description={description} />
      {children}
    </Section>
  );
}

export default function StyleguidePage() {
  const officialLogo = hasBrandFile("logo-horizontal.svg");

  return (
    <>
      <Section tone="paper">
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Styleguide" }]}
          className="mb-12"
        />
        <h1 className="font-display text-h1">
          Styleguide
          <i aria-hidden className="title-mark" />
        </h1>
        <p className="mt-6 max-w-[54ch] font-text text-lead text-muted-foreground">
          Branco, vermelho e preto; Archivo em tudo, semicondensada nos títulos; linhas de 1px e
          muito espaço. O vermelho é acento, usado poucas vezes por tela. Esta página é interna e
          não aparece nos buscadores.
        </p>
        <nav aria-label="Seções do styleguide" className="mt-12">
          <ul className="flex flex-wrap gap-2">
            {index.map(([id, label]) => (
              <li key={id}>
                <Chip asChild>
                  <a href={`#${id}`}>{label}</a>
                </Chip>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Block
        id="cores"
        title="Cores"
        description="Contraste calculado pela fórmula do WCAG 2.1 a partir de src/lib/tokens.ts."
      >
        <ul className="grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-5">
          {swatches.map((s) => (
            <li
              key={s.token}
              className="flex min-h-40 flex-col justify-between gap-4 p-4"
              style={{ backgroundColor: s.hex, color: s.fg }}
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="font-mono text-xs opacity-80">
                  {s.token} {s.hex}
                </p>
              </div>
              <p className="text-xs leading-snug tabular-nums">{s.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 mb-3 text-meta text-muted-foreground">Tema escuro</p>
        <ul className="grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-4">
          {darkSwatches.map((s) => (
            <li
              key={s.name}
              className="flex min-h-28 flex-col justify-between gap-3 p-4"
              style={{ backgroundColor: s.hex, color: s.fg }}
            >
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs tabular-nums">{s.note}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="tipografia"
        title="Tipografia"
        description="Archivo, da Omnibus-Type (Buenos Aires), em tudo: semicondensada e peso 600 nos títulos; largura normal, 400 e 500, na leitura e na interface."
      >
        <ol className="flex flex-col">
          {typeScale.map((t) => (
            <li
              key={t.token}
              className="grid gap-2 border-t border-hair py-6 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-8"
            >
              <code className="font-mono text-xs text-muted-foreground">{t.token}</code>
              <p className={cn("min-w-0 [overflow-wrap:anywhere]", t.className)}>{t.sample}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <article className="prose-editorial lg:col-span-7">
            <h2>A dependência como estrutura</h2>
            <p>
              Em <em>Dialética da dependência</em> (1973), Ruy Mauro Marini sustenta que a inserção
              da América Latina no mercado mundial não foi um atraso a ser superado, e sim uma forma
              específica de desenvolvimento capitalista. A transferência de valor para as economias
              centrais é compensada, na periferia, pela{" "}
              <Popover>
                <PopoverTrigger className="cursor-help underline decoration-brand-text decoration-dotted decoration-1 underline-offset-4">
                  superexploração da força de trabalho
                </PopoverTrigger>
                <PopoverContent>
                  <p className="font-display text-xl">Superexploração</p>
                  <p className="mt-2 font-text text-base leading-snug text-muted-foreground">
                    Exemplo de verbete do glossário em popover. A definição revisada entra na Fase
                    2.
                  </p>
                  <Link
                    href="/glossario"
                    className="link-underline mt-4 inline-block text-sm font-medium"
                  >
                    Abrir o glossário
                  </Link>
                </PopoverContent>
              </Popover>
              .
            </p>
            <p>
              Termos do glossário aparecem com sublinhado pontilhado e abrem a definição. As notas
              de rodapé abrem em popover, com link de volta ao texto.
            </p>
          </article>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            <p className="text-meta text-muted-foreground">Títulos (semicondensada)</p>
            <p className="font-display text-4xl font-medium">Questão agrária</p>
            <p className="font-display text-4xl">Mais-valia</p>
            <p className="font-display text-4xl font-medium italic">Práxis</p>
            <p className="mt-6 text-meta text-muted-foreground">
              Leitura e interface (largura normal)
            </p>
            <p className="text-base">Archivo 400</p>
            <p className="text-base font-medium">Archivo 500</p>
          </div>
        </div>
      </Block>

      <Block
        id="marca"
        title="Marca"
        description={
          officialLogo
            ? "Arquivos oficiais detectados em public/brand/."
            : "Logo provisória. Coloque os arquivos em public/brand/ (ver README.md lá) e o site passa a usá-los sozinho."
        }
      >
        <div className="grid gap-px md:grid-cols-3">
          {logoBackgrounds.map((bg) => (
            <div
              key={bg.label}
              className={cn(bg.className, "flex min-h-64 flex-col justify-between gap-10 p-8")}
            >
              <p className="text-meta opacity-70">Sobre {bg.label.toLowerCase()}</p>
              <Logo variant="horizontal" tone={bg.logoTone} className="text-[32px]" />
              <div className="flex items-end gap-5">
                <Logo variant="simbolo" tone={bg.logoTone} className="text-[40px]" />
                <Logo variant="simbolo" tone={bg.logoTone} className="text-[24px]" />
                <Logo variant="simbolo" tone={bg.logoTone} className="text-[16px]" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="border-t border-hair pt-4 text-sm">
            <p className="font-medium">Tons</p>
            <p className="mt-1 text-muted-foreground">
              color para fundo branco; light para preto e vermelho; dark para impressão em uma cor.
              O padrão auto segue o tema.
            </p>
          </div>
          <div className="border-t border-hair pt-4 text-sm">
            <p className="font-medium">Header</p>
            <p className="mt-1 text-muted-foreground">
              Símbolo de 26 a 28px (área máxima de 32px no mobile e 40px no desktop). Ao rolar, fica
              só o símbolo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 border-t border-hair pt-4">
            <Logo variant="vertical" className="text-[32px]" />
            <Logo variant="horizontal" tone="dark" className="text-[24px]" />
          </div>
        </div>
      </Block>

      <Block
        id="botoes"
        title="Botões"
        description="Principal em vermelho chapado (um por tela); contorno de 1px; link sublinhado que encolhe no hover."
      >
        <div className="grid gap-px border border-hair bg-hair md:grid-cols-2">
          {(["paper", "ink"] as const).map((tone) => (
            <div key={tone} className={cn(`tone-${tone}`, "flex flex-col items-start gap-6 p-8")}>
              <p className="text-meta text-muted-foreground">
                Sobre {tone === "paper" ? "branco" : "preto"}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Button>Comece a estudar</Button>
                <Button variant="link">Explore a biblioteca</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="outline">Copiar referência</Button>
                <Button size="sm">Pequeno</Button>
                <Button size="sm" variant="outline">
                  Pequeno
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        id="chips"
        title="Chips e nível"
        description="Chips levam aos filtros; como botões de filtro, usam aria-pressed. A área de toque tem 44px."
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap gap-2">
            <Chip asChild>
              <Link href="/artigos?tradicao=marxismo-classico">Marxismo clássico</Link>
            </Chip>
            <Chip asChild>
              <Link href="/artigos?area=economia-politica">Economia política</Link>
            </Chip>
            <Chip asChild variant="solid">
              <Link href="/artigos?regiao=america-latina">América Latina</Link>
            </Chip>
            <Chip size="sm">Pequeno</Chip>
          </div>
          <ChipToggleDemo />
          <div className="flex flex-wrap gap-10">
            <LevelBadge nivel="introdutorio" />
            <LevelBadge nivel="intermediario" />
            <LevelBadge nivel="avancado" />
          </div>
        </div>
      </Block>

      <Block
        id="artigos"
        title="Artigos"
        description="Destaque, padrão e compacto. Títulos de exemplo, assinados pela Redação."
      >
        <div className="grid-page gap-y-14">
          <ArticleCard
            article={sampleArticles[0]!}
            variant="feature"
            className="col-span-12 lg:col-span-7"
          />
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            {sampleArticles.slice(1).map((article) => (
              <ArticleCard key={article.titulo} article={article} variant="compact" />
            ))}
          </div>
          <div className="col-span-12 grid gap-12 md:grid-cols-3">
            {sampleArticles.slice(1).map((article) => (
              <ArticleCard key={article.titulo} article={article} />
            ))}
          </div>
        </div>
      </Block>

      <Block
        id="livros"
        title="Livros"
        description="Capas geradas no espírito das coleções de bolso: um campo de cor, um sinal geométrico por tradição e o título em Archivo semicondensada."
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {sampleBooks.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
        <div className="mt-16">
          {sampleBooks.slice(2, 4).map((book) => (
            <BookCard key={book.slug} book={book} variant="list" />
          ))}
        </div>
      </Block>

      <Block
        id="autores"
        title="Autores"
        description="Sem retrato licenciado, o card mostra as iniciais numa moldura fina."
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {sampleAuthors.map((author) => (
            <AuthorCard key={author.nome} author={author} />
          ))}
        </div>
      </Block>

      <Block id="citacao" title="Citação">
        <QuoteBlock
          text="Os filósofos apenas interpretaram o mundo de diferentes maneiras; o que importa é transformá-lo."
          autor="Karl Marx"
          fonte={
            <>
              <em>Teses sobre Feuerbach</em>, tese XI (1845)
            </>
          }
          nota="[CONFERIR tradução e edição de referência]"
        />
      </Block>

      <Block id="navegacao" title="Navegação">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <Breadcrumb
              items={[
                { label: "Início", href: "/" },
                { label: "Biblioteca", href: "/biblioteca" },
                { label: "Dialética da dependência" },
              ]}
            />
            <Pagination
              page={4}
              totalPages={12}
              hrefFor={(p) => `/styleguide?pagina=${p}#navegacao`}
            />
            <Tabs defaultValue="abnt">
              <TabsList>
                <TabsTrigger value="abnt">ABNT</TabsTrigger>
                <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
              </TabsList>
              <TabsContent value="abnt">
                <p className="font-text text-lg leading-relaxed">
                  MARINI, Ruy Mauro. <strong>Dialética da dependência</strong>. [CONFERIR local]:
                  [CONFERIR editora], [CONFERIR ano].
                </p>
              </TabsContent>
              <TabsContent value="bibtex">
                <pre className="overflow-x-auto border-l-2 border-brand bg-muted p-4 font-mono text-sm">{`@book{marini_dialetica,
  author = {Marini, Ruy Mauro},
  title  = {Dialética da dependência},
  year   = {[CONFERIR]}
}`}</pre>
              </TabsContent>
            </Tabs>
          </div>
          <Accordion type="single" collapsible defaultValue="antes">
            <AccordionItem value="antes">
              <AccordionTrigger>Ler antes</AccordionTrigger>
              <AccordionContent>
                <p className="font-text text-lg text-muted-foreground">
                  Livros que preparam a leitura, encadeados na ficha de cada obra.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="depois">
              <AccordionTrigger>Ler depois</AccordionTrigger>
              <AccordionContent>
                <p className="font-text text-lg text-muted-foreground">
                  Desdobramentos e debates que partem da obra.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="onde">
              <AccordionTrigger>Onde encontrar</AccordionTrigger>
              <AccordionContent>
                <p className="font-text text-lg text-muted-foreground">
                  Links para editoras e bibliotecas públicas. Nunca PDFs de obras protegidas.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Block>

      <Block
        id="sobreposicoes"
        title="Sobreposições"
        description="Modal, drawer inferior de filtros (padrão no mobile) e toast. Com qualquer um aberto, o smooth scroll pausa."
      >
        <OverlayDemos />
      </Block>

      <Block
        id="imagens"
        title="Imagens"
        description="Fotos históricas em duotone ou retícula. Até existirem fotos em domínio público, usamos uma retícula gerada como imagem ilustrativa."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <figure className="m-0">
            <div className="aspect-[4/3] overflow-hidden">
              <HalftonePhoto
                seed={41}
                horizon={0.52}
                label="Ilustração em retícula preta com bandeira vermelha"
              />
            </div>
            <figcaption className="mt-3 text-meta text-muted-foreground">
              Retícula preta sobre branco, bandeira vermelha.
            </figcaption>
          </figure>
          <figure className="m-0">
            <div className="aspect-[4/3] overflow-hidden">
              <HalftonePhoto
                seed={23}
                horizon={0.56}
                tone="ink"
                label="Ilustração em retícula vermelha sobre preto"
              />
            </div>
            <figcaption className="mt-3 text-meta text-muted-foreground">
              Retícula vermelha sobre preto, bandeira branca.
            </figcaption>
          </figure>
        </div>
      </Block>

      <Block
        id="motion"
        title="Motion"
        description="Calmo e curto. O hero entra em CSS na primeira pintura; o GSAP cuida do que depende de rolagem (entradas de seção, parallax, pin)."
      >
        <Reveal className="grid border-t border-hair sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Rápido", `${motion.duration.fast}s`, "hover, foco, chips"],
            ["Base", `${motion.duration.base}s`, "menus, drawers, troca de estado"],
            ["Lento", `${motion.duration.slow}s`, "entradas de seção"],
            ["Stagger", `${motion.stagger}s`, `deslocamento de ${motion.distance}px`],
          ].map(([name, value, use]) => (
            <div
              key={name}
              data-reveal
              className="flex flex-col gap-2 border-b border-hair py-8 sm:pr-8"
            >
              <p className="text-meta text-muted-foreground">{name}</p>
              <p className="font-display text-5xl tabular-nums">{value}</p>
              <p className="text-sm text-muted-foreground">{use}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 max-w-[60ch] text-sm text-muted-foreground">
          Curva padrão: cubic-bezier({motion.easeCurve}). Pin e parallax só no desktop e nunca com
          prefers-reduced-motion.
        </p>
      </Block>
    </>
  );
}
