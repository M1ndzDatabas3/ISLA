/**
 * Newsletter: validação, texto de consentimento e o provedor de envio.
 * O provedor definitivo (Buttondown, Resend ou similar) entra depois; até lá,
 * o provisório só aceita inscrições em desenvolvimento e não guarda nada.
 */
import { z } from "zod";

export { consentimentoNewsletter, type NewsletterState } from "./newsletter-consent";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Informe seu e-mail." })
    .pipe(z.email({ error: "Confira o e-mail: ele precisa ter o formato nome@exemplo.org." })),
  consentimento: z.literal("on", {
    error: "Para receber a newsletter, marque a autorização.",
  }),
});

export interface Inscricao {
  email: string;
  /** Registro do consentimento (LGPD, art. 8º): quando e com qual texto. */
  consentimento: { em: string; versao: string };
  origem: string;
}

export type ResultadoInscricao =
  { ok: true; teste?: boolean } | { ok: false; motivo: "indisponivel" | "falha" };

export interface NewsletterProvider {
  subscribe(inscricao: Inscricao): Promise<ResultadoInscricao>;
}

/** Provedor provisório: aceita em desenvolvimento (sem gravar) e recusa em produção. */
const provisorio: NewsletterProvider = {
  async subscribe(inscricao) {
    if (process.env.NODE_ENV === "production") return { ok: false, motivo: "indisponivel" };
    const [usuario = "", dominio = ""] = inscricao.email.split("@");
    console.info(
      `[newsletter] inscrição de teste: ${usuario.slice(0, 2)}***@${dominio}, consentimento ${inscricao.consentimento.versao}`,
    );
    return { ok: true, teste: true };
  },
};

export const newsletterProvider: NewsletterProvider = provisorio;
