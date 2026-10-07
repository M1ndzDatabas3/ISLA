/** Inscrição na chamada aberta do Mural: texto de consentimento e estado do formulário (compartilhados com o cliente). */

export const consentimentoInscricao = {
  versao: "2026-10",
  texto:
    "Autorizo o Instituto a guardar estes dados para avaliar minha inscrição no Mural e falar comigo sobre ela. Li a Política de privacidade e sei que posso pedir a exclusão quando quiser.",
} as const;

export type InscricaoCampo =
  | "nome"
  | "email"
  | "whatsapp"
  | "uf"
  | "cidade"
  | "linguagens"
  | "links"
  | "sobre"
  | "consentimento";

export type InscricaoState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<InscricaoCampo, string>>;
      values?: Record<string, string | string[]>;
    };
