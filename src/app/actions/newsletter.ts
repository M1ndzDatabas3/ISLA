"use server";

import { z } from "zod";

import {
  consentimentoNewsletter,
  newsletterProvider,
  newsletterSchema,
  type NewsletterState,
} from "@/lib/newsletter";

const sucesso: NewsletterState = {
  status: "success",
  message:
    "Inscrição recebida. Enviamos um e-mail para você confirmar; sem a confirmação, nada é enviado.",
};

export async function subscribeToNewsletter(
  _anterior: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "");

  // Campo invisível para pessoas; robôs costumam preenchê-lo.
  if (String(formData.get("site") ?? "").length > 0) return sucesso;

  const parsed = newsletterSchema.safeParse({
    email,
    consentimento: formData.get("consentimento") ?? undefined,
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Revise o formulário: há campos a corrigir.",
      fieldErrors: { email: fieldErrors.email?.[0], consentimento: fieldErrors.consentimento?.[0] },
      values: { email },
    };
  }

  const resultado = await newsletterProvider.subscribe({
    email: parsed.data.email,
    consentimento: { em: new Date().toISOString(), versao: consentimentoNewsletter.versao },
    origem: String(formData.get("origem") ?? "site").slice(0, 40),
  });

  if (!resultado.ok) {
    return {
      status: "error",
      message:
        resultado.motivo === "indisponivel"
          ? "As inscrições na newsletter abrem em breve. Nenhum dado foi guardado."
          : "Não foi possível concluir a inscrição agora. Tente de novo em alguns minutos.",
      values: { email },
    };
  }
  if (resultado.teste) {
    return {
      status: "success",
      message:
        "Inscrição de teste aceita. O envio de e-mails ainda não está ativo, então nada foi guardado.",
    };
  }
  return sucesso;
}
