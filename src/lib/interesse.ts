/**
 * "Participe", caminho de produção de conteúdo: contatos de quem quer criar e
 * desenvolver conteúdo no site. O destino definitivo (Supabase, na fase 4) entra
 * depois; até lá, os contatos vão para um webhook configurável.
 */
import { z } from "zod";

import { enviarParaWebhook } from "./forms/webhook";

import { siglasUF } from "./estados";
import { digitosWhatsapp } from "./interesse-consent";
import { municipioExiste } from "./localidades";

export { consentimentoInteresse, type InteresseState } from "./interesse-consent";

export const interesseSchema = z
  .object({
    nome: z.string().trim().min(2, { error: "Informe seu nome." }).max(120),
    email: z
      .string()
      .trim()
      .min(1, { error: "Informe seu e-mail." })
      .pipe(z.email({ error: "Confira o e-mail: ele precisa ter o formato nome@exemplo.org." })),
    whatsapp: z
      .string()
      .transform(digitosWhatsapp)
      .refine((d) => /^[1-9]{2}9?\d{8}$/.test(d), {
        error: "Informe o WhatsApp com DDD, como (11) 91234-5678.",
      }),
    uf: z.enum(siglasUF, { error: "Escolha o estado." }),
    cidade: z.string().trim().min(1, { error: "Escolha a cidade." }),
    mensagem: z.string().trim().max(800, { error: "Use até 800 caracteres." }).optional(),
    consentimento: z.literal("on", { error: "Para enviar, marque a autorização." }),
  })
  .refine((v) => municipioExiste(v.uf, v.cidade), {
    path: ["cidade"],
    error: "Escolha uma cidade da lista.",
  });

export type Interesse = z.infer<typeof interesseSchema> & {
  consentimentoRegistro: { em: string; versao: string };
};

export type ResultadoInteresse =
  { ok: true; teste?: boolean } | { ok: false; motivo: "indisponivel" | "falha" };

export interface InteresseProvider {
  save(interesse: Interesse): Promise<ResultadoInteresse>;
}

/**
 * Destino: CONTEUDO_CONTATOS_WEBHOOK_URL (POST com JSON). Sem ele, aceita em
 * desenvolvimento sem gravar nada e recusa em produção.
 */
const viaWebhook: InteresseProvider = {
  async save(interesse) {
    const url = process.env.CONTEUDO_CONTATOS_WEBHOOK_URL;
    if (url) {
      const ok = await enviarParaWebhook(url, { tipo: "contato-conteudo", ...interesse });
      return ok ? { ok: true } : { ok: false, motivo: "falha" };
    }
    if (process.env.NODE_ENV === "production") return { ok: false, motivo: "indisponivel" };
    console.info(
      `[participe] contato de teste: ${interesse.cidade}/${interesse.uf}, consentimento ${interesse.consentimentoRegistro.versao}`,
    );
    return { ok: true, teste: true };
  },
};

export const interesseProvider: InteresseProvider = viaWebhook;
