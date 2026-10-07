/** Texto de consentimento e estado do formulário da newsletter (compartilhados com o cliente). */

/** Texto exato que a pessoa autoriza. Mude a versão sempre que mudar o texto. */
export const consentimentoNewsletter = {
  versao: "2026-10",
  texto:
    "Quero receber a newsletter do Instituto por e-mail. Li a Política de privacidade e sei que posso cancelar quando quiser.",
} as const;

export type NewsletterState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: { email?: string; consentimento?: string };
      values?: { email: string };
    };
