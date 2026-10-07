"use server";

import { z } from "zod";

import {
  consentimentoInteresse,
  interesseProvider,
  interesseSchema,
  type InteresseState,
} from "@/lib/interesse";

export async function registerInterest(
  _anterior: InteresseState,
  formData: FormData,
): Promise<InteresseState> {
  const campo = (nome: string) => String(formData.get(nome) ?? "");
  const values = {
    nome: campo("nome"),
    email: campo("email"),
    whatsapp: campo("whatsapp"),
    uf: campo("uf"),
    cidade: campo("cidade"),
    mensagem: campo("mensagem"),
  };

  // Campo invisível para pessoas; robôs costumam preenchê-lo.
  if (campo("site").length > 0) return { status: "success", message: "Recebemos seu contato." };

  const parsed = interesseSchema.safeParse({
    ...values,
    mensagem: values.mensagem || undefined,
    consentimento: formData.get("consentimento") ?? undefined,
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    const primeiro = (lista?: string[]) => lista?.[0];
    return {
      status: "error",
      message: "Revise o formulário: há campos a corrigir.",
      fieldErrors: {
        nome: primeiro(fieldErrors.nome),
        email: primeiro(fieldErrors.email),
        whatsapp: primeiro(fieldErrors.whatsapp),
        uf: primeiro(fieldErrors.uf),
        cidade: primeiro(fieldErrors.cidade),
        mensagem: primeiro(fieldErrors.mensagem),
        consentimento: primeiro(fieldErrors.consentimento),
      },
      values,
    };
  }

  const resultado = await interesseProvider.save({
    ...parsed.data,
    consentimentoRegistro: { em: new Date().toISOString(), versao: consentimentoInteresse.versao },
  });

  if (!resultado.ok) {
    return {
      status: "error",
      message:
        resultado.motivo === "indisponivel"
          ? "O cadastro abre em breve. Nenhum dado foi guardado."
          : "Não foi possível enviar agora. Tente de novo em alguns minutos.",
      values,
    };
  }
  if (resultado.teste) {
    return {
      status: "success",
      message: "Envio de teste aceito. O cadastro ainda não está ativo, então nada foi guardado.",
    };
  }
  return {
    status: "success",
    message: `Obrigado, ${parsed.data.nome.split(" ")[0]}. A equipe editorial vai falar com você.`,
  };
}
