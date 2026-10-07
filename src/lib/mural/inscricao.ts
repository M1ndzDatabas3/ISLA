/** Validação e destino das inscrições da chamada aberta do Mural. */
import { z } from "zod";

import { enviarParaWebhook } from "@/lib/forms/webhook";
import { siglasUF } from "@/lib/estados";
import { digitosWhatsapp } from "@/lib/interesse-consent";
import { municipioExiste } from "@/lib/localidades";
import { linguagensArtisticas } from "@/lib/taxonomy";

const linguagens = linguagensArtisticas.map((l) => l.slug) as [string, ...string[]];

export const inscricaoSchema = z
  .object({
    nome: z.string().trim().min(2, { error: "Informe seu nome artístico." }).max(120),
    email: z
      .string()
      .trim()
      .min(1, { error: "Informe seu e-mail." })
      .pipe(z.email({ error: "Confira o e-mail: ele precisa ter o formato nome@exemplo.org." })),
    whatsapp: z
      .string()
      .transform(digitosWhatsapp)
      .refine((d) => d === "" || /^[1-9]{2}9?\d{8}$/.test(d), {
        error: "Confira o WhatsApp, com DDD, como (11) 91234-5678.",
      }),
    /** Sigla da UF ou "EX" para quem mora fora do Brasil. */
    uf: z.union([z.enum(siglasUF), z.literal("EX")], { error: "Escolha o estado." }),
    cidade: z.string().trim().min(2, { error: "Informe a cidade." }).max(120),
    linguagens: z.array(z.enum(linguagens)).min(1, { error: "Marque ao menos uma linguagem." }),
    links: z
      .string()
      .transform((v) =>
        v
          .split(/\s+/)
          .map((l) => l.trim())
          .filter(Boolean),
      )
      .pipe(
        z
          .array(z.url({ error: "Use links completos, começando por https://." }))
          .min(1, { error: "Envie ao menos um link do seu trabalho." })
          .max(6, { error: "Envie no máximo seis links." }),
      ),
    sobre: z
      .string()
      .trim()
      .min(30, { error: "Conte um pouco mais sobre o seu trabalho (mínimo de 30 caracteres)." })
      .max(1000, { error: "Use até 1.000 caracteres." }),
    consentimento: z.literal("on", { error: "Para enviar, marque a autorização." }),
  })
  .refine((v) => v.uf === "EX" || municipioExiste(v.uf, v.cidade), {
    path: ["cidade"],
    error: "Escolha uma cidade da lista.",
  });

export type Inscricao = z.infer<typeof inscricaoSchema>;

export type ResultadoInscricao =
  { ok: true; teste?: boolean } | { ok: false; motivo: "indisponivel" | "falha" };

/**
 * Destino: MURAL_INSCRICOES_WEBHOOK_URL (POST com JSON). Sem ele, aceita em
 * desenvolvimento sem gravar nada e recusa em produção.
 */
export async function salvarInscricao(
  dados: Omit<Inscricao, "consentimento"> & { consentimento: { em: string; versao: string } },
): Promise<ResultadoInscricao> {
  const url = process.env.MURAL_INSCRICOES_WEBHOOK_URL;
  if (url) {
    const ok = await enviarParaWebhook(url, { tipo: "inscricao-mural", ...dados });
    return ok ? { ok: true } : { ok: false, motivo: "falha" };
  }
  if (process.env.NODE_ENV === "production") return { ok: false, motivo: "indisponivel" };
  console.info(
    `[mural] inscrição de teste: ${dados.cidade}/${dados.uf}, ${dados.linguagens.join(", ")}`,
  );
  return { ok: true, teste: true };
}
