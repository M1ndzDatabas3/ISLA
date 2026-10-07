/**
 * Coleções de conteúdo (MVP em /content). Os schemas espelham o que um CMS
 * headless (Payload ou Sanity) teria; só src/lib/content/ lê estes dados.
 * Regra editorial: dado incerto (ano, editora, ISBN, tradução) leva "[CONFERIR]".
 */
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import {
  areas,
  disponibilidades,
  niveis,
  regioes,
  tiposDeArtigo,
  tiposDeObra,
  tradicoes,
} from "./src/lib/taxonomy";

const slugsOf = (list: readonly { slug: string }[]) =>
  list.map((t) => t.slug) as [string, ...string[]];

const tradicao = z.enum(slugsOf(tradicoes));
const area = z.enum(slugsOf(areas));
const regiao = z.enum(slugsOf(regioes));
const nivel = z.enum(slugsOf(niveis));

/** Imagem com crédito obrigatório (só domínio público ou CC). */
const imagem = z.object({
  src: z.string(),
  alt: z.string(),
  credito: z.string(),
  licenca: z.string(),
  fonte: z.string().optional(),
});

const mdxOptions = { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] };

/** Sumário a partir dos títulos ## e ### (mesmos ids que o rehype-slug gera). */
function tableOfContents(content: string) {
  const slugger = new GithubSlugger();
  return [...content.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)].map((match) => {
    const text = match[2]!.replace(/[*_`]/g, "").trim();
    return { depth: match[1]!.length as 2 | 3, text, id: slugger.slug(text) };
  });
}

function readingMinutes(content: string) {
  const words = content
    .replace(/[#>*_`\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const autores = defineCollection({
  name: "autores",
  directory: "content/autores",
  include: "*.mdx",
  schema: z.object({
    nome: z.string(),
    nomeCompleto: z.string().optional(),
    nascimento: z.number().int().optional(),
    morte: z.number().int().optional(),
    nacionalidade: z.string(),
    bioCurta: z.string().max(320),
    tradicoes: z.array(tradicao).min(1),
    regioes: z.array(regiao).default([]),
    influenciadoPor: z.array(z.string()).default([]),
    retrato: imagem.optional(),
    /** Campos a revisar por uma pessoa (ex.: ["nascimento"]). */
    conferir: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const livros = defineCollection({
  name: "livros",
  directory: "content/livros",
  include: "*.mdx",
  schema: z.object({
    titulo: z.string(),
    tituloCapa: z.string().optional(),
    tituloOriginal: z.string().optional(),
    idiomaOriginal: z.string().optional(),
    autores: z.array(z.string()).min(1),
    /** Ano da primeira publicação. */
    ano: z.number().int(),
    sinopse: z.string(),
    tradicoes: z.array(tradicao).min(1),
    areas: z.array(area).min(1),
    regioes: z.array(regiao).min(1),
    nivel,
    tipoDeObra: z.enum(slugsOf(tiposDeObra)),
    disponibilidade: z.array(z.enum(slugsOf(disponibilidades))).min(1),
    edicoes: z
      .array(
        z.object({
          editora: z.string(),
          cidade: z.string().optional(),
          ano: z.union([z.number().int(), z.string()]).optional(),
          tradutor: z.string().optional(),
          isbn: z.string().optional(),
          observacao: z.string().optional(),
        }),
      )
      .default([]),
    lerAntes: z.array(z.string()).default([]),
    lerDepois: z.array(z.string()).default([]),
    linksExternos: z.array(z.object({ rotulo: z.string(), url: z.url() })).default([]),
    destaque: z.boolean().default(false),
    /** Campos a revisar por uma pessoa (ex.: ["ano", "edicoes"]). */
    conferir: z.array(z.string()).default([]),
    /** Corpo do arquivo: "Por que ler". */
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const conceitos = defineCollection({
  name: "conceitos",
  directory: "content/glossario",
  include: "*.mdx",
  schema: z.object({
    termo: z.string(),
    definicaoCurta: z.string().max(300),
    autores: z.array(z.string()).default([]),
    relacionados: z.array(z.string()).default([]),
    tradicoes: z.array(tradicao).default([]),
    areas: z.array(area).default([]),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const artigos = defineCollection({
  name: "artigos",
  directory: "content/artigos",
  include: "*.mdx",
  schema: z.object({
    titulo: z.string(),
    linhaFina: z.string(),
    assinatura: z.string().default("Redação do Instituto"),
    /** Data ISO (AAAA-MM-DD). */
    data: z.iso.date(),
    tipo: z.enum(slugsOf(tiposDeArtigo)),
    nivel,
    tema: z.object({ dimensao: z.enum(["tradicao", "area", "regiao"]), slug: z.string() }),
    tradicoes: z.array(tradicao).default([]),
    areas: z.array(area).default([]),
    regioes: z.array(regiao).default([]),
    capa: imagem.optional(),
    livros: z.array(z.string()).default([]),
    conceitos: z.array(z.string()).default([]),
    autoresCitados: z.array(z.string()).default([]),
    trilha: z.string().optional(),
    destaque: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    mdx: await compileMDX(context, doc, mdxOptions),
    toc: tableOfContents(doc.content),
    leituraMin: readingMinutes(doc.content),
  }),
});

const trilhas = defineCollection({
  name: "trilhas",
  directory: "content/trilhas",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    nivel,
    duracao: z.string(),
    ordem: z.number().int(),
    etapas: z
      .array(
        z.object({
          tipo: z.enum(["texto", "livro", "capitulo", "video", "verbete", "artigo"]),
          titulo: z.string(),
          /** Slug de livro, verbete ou artigo da plataforma, ou URL externa. */
          referencia: z.string().optional(),
          tempo: z.string(),
          perguntas: z.array(z.string()).default([]),
        }),
      )
      .min(1),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const marcos = defineCollection({
  name: "marcos",
  directory: "content/marcos",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    ano: z.number().int(),
    data: z.string().optional(),
    titulo: z.string(),
    resumo: z.string(),
    regiao,
    areas: z.array(area).default([]),
    livros: z.array(z.string()).default([]),
    autores: z.array(z.string()).default([]),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const citacoes = defineCollection({
  name: "citacoes",
  directory: "content/citacoes",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    texto: z.string(),
    autor: z.string(),
    fonte: z.string(),
    /** Ex.: "[CONFERIR tradução]". */
    conferir: z.string().optional(),
    livro: z.string().optional(),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const eventos = defineCollection({
  name: "eventos",
  directory: "content/eventos",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(["curso", "grupo-de-leitura", "debate", "lancamento", "aula-aberta"]),
    inicio: z.iso.datetime({ offset: true }),
    local: z.string(),
    descricao: z.string(),
    link: z.url().optional(),
    /** Evento de demonstração: aparece com o selo "Exemplo". */
    exemplo: z.boolean().default(false),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const episodios = defineCollection({
  name: "episodios",
  directory: "content/episodios",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    titulo: z.string(),
    numero: z.number().int(),
    formato: z.enum(["podcast", "video"]),
    data: z.iso.date(),
    duracaoMin: z.number().int(),
    resumo: z.string(),
    link: z.url().optional(),
    exemplo: z.boolean().default(false),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const obrasCulturais = defineCollection({
  name: "obrasCulturais",
  directory: "content/cultura",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(["filme", "musica", "literatura", "artes-visuais"]),
    autoria: z.string(),
    ano: z.number().int(),
    pais: z.string(),
    resumo: z.string(),
    conferir: z.string().optional(),
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

export default defineConfig({
  content: [
    autores,
    livros,
    conceitos,
    artigos,
    trilhas,
    marcos,
    citacoes,
    eventos,
    episodios,
    obrasCulturais,
  ],
});
