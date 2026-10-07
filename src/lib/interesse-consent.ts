/** Formulário "Faça parte": texto de consentimento e estado (compartilhados com o cliente). */

/** Texto exato que a pessoa autoriza. Mude a versão sempre que mudar o texto. */
export const consentimentoInteresse = {
  versao: "2026-10b",
  texto:
    "Autorizo o Instituto a guardar estes dados para falar comigo, por e-mail ou WhatsApp, sobre produção de conteúdo. Li a Política de privacidade e sei que posso pedir a exclusão quando quiser.",
} as const;

export type InteresseCampo =
  "nome" | "email" | "whatsapp" | "uf" | "cidade" | "mensagem" | "consentimento";

export type InteresseValores = Record<Exclude<InteresseCampo, "consentimento">, string>;

export type InteresseState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<InteresseCampo, string>>;
      values?: InteresseValores;
    };

/** Só os dígitos, sem o +55. */
export function digitosWhatsapp(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length > 11 && digitos.startsWith("55") ? digitos.slice(2) : digitos;
}

/** "11912345678" → "(11) 91234-5678", formatando enquanto a pessoa digita. */
export function formatarWhatsapp(valor: string) {
  const d = digitosWhatsapp(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  const corte = resto.length > 8 ? 5 : 4;
  return resto.length > corte
    ? `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
    : `(${ddd}) ${resto}`;
}
