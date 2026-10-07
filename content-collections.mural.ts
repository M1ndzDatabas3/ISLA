/**
 * Coleções do Mural Cultural (content/mural). Regras que viram erro de build:
 * - perfil publicado sem autorização registrada;
 * - obra sem texto alternativo descritivo;
 * - download liberado sem licença Creative Commons ou sem arquivo;
 * - imagem ou arquivo que não existe em /public.
 * Dimensões e blur das imagens são lidos do próprio arquivo.
 */
import { defineCollection } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import rehypeConferir from "./src/lib/mdx/rehype-conferir";
import rehypeTypography from "./src/lib/mdx/rehype-typography";
import { readFileSize, readImageMeta } from "./src/lib/mural/image-meta";
import {
  licencas,
  linguagensArtisticas,
  linguagensClassicas,
  temasDoMural,
} from "./src/lib/taxonomy";

/** Slugs como tupla de literais, para os tipos gerados preservarem os valores. */
const slugsOf = <T extends readonly { slug: string }[]>(list: T) =>
  list.map((t) => t.slug) as [T[number]["slug"], ...T[number]["slug"][]];

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, rehypeConferir, rehypeTypography],
};

const linguagem = z.enum(slugsOf(linguagensArtisticas));
const tema = z.enum(slugsOf(temasDoMural));
const licenca = z.enum(slugsOf(licencas));
const caminho = z
  .string()
  .startsWith("/", { error: "Use o caminho a partir de /public, começando por /mural/…" });
const altText = z
  .string({ error: "Texto alternativo obrigatório." })
  .min(15, {
    error:
      "Texto alternativo curto demais: descreva o que a imagem mostra (mínimo de 15 caracteres).",
  });

/** Conteúdo de demonstração: só aparece fora de produção ou com MURAL_DEMO=1. */
const demo = z.boolean().default(false);

const imagemDeObra = z.object({
  src: caminho,
  alt: altText,
  /** Crédito da fotografia da obra (quem fotografou), se não for o próprio artista. */
  credito: z.string().optional(),
});

async function comMeta<T extends { src: string }>(img: T) {
  return { ...img, ...(await readImageMeta(img.src)) };
}

export const artistas = defineCollection({
  name: "artistas",
  directory: "content/mural/artistas",
  include: "*.mdx",
  schema: z
    .object({
      /** Nome artístico (como aparece no site). */
      nome: z.string(),
      nomeCivil: z.string().optional(),
      cidade: z.string(),
      /** Sigla da UF, para artistas do Brasil. */
      estado: z.string().length(2).optional(),
      pais: z.string().default("Brasil"),
      linguagens: z.array(linguagem).min(1),
      bioCurta: z.string().max(280),
      /** Bio longa; parágrafos separados por linha em branco. */
      bio: z.string().optional(),
      retrato: z.object({ src: caminho, alt: altText, credito: z.string().optional() }).optional(),
      links: z
        .object({
          instagram: z.url().optional(),
          site: z.url().optional(),
          behance: z.url().optional(),
          bandcamp: z.url().optional(),
          youtube: z.url().optional(),
          loja: z.url().optional(),
          /** URL ou mailto: para encomendas. */
          encomendas: z.string().optional(),
        })
        .default({}),
      temas: z.array(tema).default([]),
      /** Autorização por escrito do artista para publicar o perfil e as obras. */
      autorizacao: z
        .object({
          data: z.iso.date(),
          escopo: z.string().min(10),
          observacoes: z.string().optional(),
        })
        .optional(),
      status: z.enum(["rascunho", "publicado"]).default("rascunho"),
      destaque: z.boolean().default(false),
      publicadoEm: z.iso.date().optional(),
      demo,
      /** Corpo do arquivo: entrevista (### pergunta, parágrafos de resposta). */
      content: z.string(),
    })
    .refine((a) => a.status !== "publicado" || a.autorizacao, {
      error:
        "Perfil publicado precisa de autorização registrada (campo autorizacao: data e escopo).",
      path: ["autorizacao"],
    }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    retrato: doc.retrato ? await comMeta(doc.retrato) : null,
    temEntrevista: doc.content.trim().length > 0,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

export const obras = defineCollection({
  name: "obras",
  directory: "content/mural/obras",
  include: "*.yaml",
  parser: "yaml",
  schema: z
    .object({
      titulo: z.string(),
      /** Slug do artista (arquivo em content/mural/artistas). */
      artista: z.string(),
      ano: z.number().int(),
      linguagem,
      /** Técnica em texto livre: "xilogravura sobre papel", "acrílica sobre muro"… */
      tecnica: z.string(),
      dimensoes: z.string().optional(),
      imagens: z.array(imagemDeObra).min(1),
      descricao: z.string(),
      comentarioCuratorial: z.string().optional(),
      temas: z.array(tema).default([]),
      licenca: licenca.default("todos-os-direitos-reservados"),
      permiteDownload: z.boolean().default(false),
      arquivoParaDownload: caminho.optional(),
      /** Instrução de impressão (cartazes). */
      impressao: z.object({ formato: z.string(), observacao: z.string().optional() }).optional(),
      textosRelacionados: z
        .array(
          z.object({
            tipo: z.enum(["artigo", "trilha", "verbete", "livro"]),
            slug: z.string(),
          }),
        )
        .default([]),
      disponivelParaVenda: z.boolean().default(false),
      linkDeVenda: z.url().optional(),
      publicadoEm: z.iso.date(),
      demo,
    })
    .refine((o) => !o.permiteDownload || o.licenca !== "todos-os-direitos-reservados", {
      error: "Download só com licença Creative Commons escolhida pelo artista.",
      path: ["permiteDownload"],
    })
    .refine((o) => !o.permiteDownload || o.arquivoParaDownload, {
      error: "permiteDownload: true exige arquivoParaDownload (alta resolução).",
      path: ["arquivoParaDownload"],
    }),
  transform: async (doc) => ({
    ...doc,
    slug: doc._meta.path,
    imagens: await Promise.all(doc.imagens.map(comMeta)),
    tamanhoDoDownload: doc.arquivoParaDownload ? await readFileSize(doc.arquivoParaDownload) : null,
  }),
});

export const exposicoes = defineCollection({
  name: "exposicoes",
  directory: "content/mural/exposicoes",
  include: "*.mdx",
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string().optional(),
    curadoria: z.array(z.string()).min(1),
    /** Obras na ordem da visita (as "salas"). */
    obras: z.array(z.string()).min(1),
    /** Capa própria; sem ela, usa a primeira obra. */
    capa: z.object({ src: caminho, alt: altText, credito: z.string().optional() }).optional(),
    trilha: z.string().optional(),
    inicio: z.iso.date(),
    fim: z.iso.date().optional(),
    demo,
    /** Corpo: texto curatorial de abertura. */
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    capa: doc.capa ? await comMeta(doc.capa) : null,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

export const classicos = defineCollection({
  name: "classicos",
  directory: "content/mural/classicos",
  include: "*.mdx",
  schema: z.object({
    titulo: z.string(),
    autoria: z.string(),
    ano: z.number().int(),
    pais: z.string(),
    linguagem: z.enum(slugsOf(linguagensClassicas)),
    sinopse: z.string(),
    /** Só imagem em domínio público ou licenciada, com crédito. */
    imagem: z
      .object({
        src: caminho,
        alt: altText,
        credito: z.string(),
        licenca: z.string(),
        fonte: z.string().optional(),
      })
      .optional(),
    ondeEncontrar: z.array(z.object({ rotulo: z.string(), url: z.url() })).default([]),
    conceitos: z.array(z.string()).default([]),
    autores: z.array(z.string()).default([]),
    conferir: z.string().optional(),
    /** Corpo: leitura crítica. */
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    imagem: doc.imagem ? await comMeta(doc.imagem) : null,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

export const capas = defineCollection({
  name: "capas",
  directory: "content/mural/capas",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    /** Mês da capa, "AAAA-MM". */
    mes: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, { error: 'Use o formato "AAAA-MM".' }),
    obra: z.string(),
    /** Conteúdo do Instituto que a obra ilustra. */
    ilustra: z.object({ tipo: z.enum(["artigo", "trilha"]), slug: z.string() }).optional(),
    /** Texto curto do artista sobre a obra. */
    texto: z.string().max(400),
    demo,
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

/** Textos editáveis do Mural (manifesto, compromisso, chamada aberta). */
export const muralTextos = defineCollection({
  name: "muralTextos",
  directory: "content/mural/textos",
  include: "*.mdx",
  schema: z.object({
    titulo: z.string(),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    slug: doc._meta.path,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});
