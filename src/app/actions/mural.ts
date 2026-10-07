"use server";

import { z } from "zod";

import { consentimentoInscricao, type InscricaoState } from "@/lib/mural/inscricao-consent";
import { inscricaoSchema, salvarInscricao } from "@/lib/mural/inscricao";

export async function inscreverNoMural(
  _anterior: InscricaoState,
  formData: FormData,
): Promise<InscricaoState> {
  const campo = (nome: string) => String(formData.get(nome) ?? "");
  const values = {
    nome: campo("nome"),
    email: campo("email"),
    whatsapp: campo("whatsapp"),
    uf: campo("uf"),
    cidade: campo("cidade"),
    links: campo("links"),
    sobre: campo("sobre"),
    linguagens: formData.getAll("linguagens").map(String),
  };

  // Campo invisível para pessoas; robôs costumam preenchê-lo.
  if (campo("site").length > 0) return { status: "success", message: "Recebemos sua inscrição." };

  const parsed = inscricaoSchema.safeParse({
    ...values,
    consentimento: formData.get("consentimento") ?? undefined,
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    const primeiro = (l?: string[]) => l?.[0];
    return {
      status: "error",
      message: "Revise o formulário: há campos a corrigir.",
      fieldErrors: {
        nome: primeiro(fieldErrors.nome),
        email: primeiro(fieldErrors.email),
        whatsapp: primeiro(fieldErrors.whatsapp),
        uf: primeiro(fieldErrors.uf),
        cidade: primeiro(fieldErrors.cidade),
        linguagens: primeiro(fieldErrors.linguagens),
        links: primeiro(fieldErrors.links),
        sobre: primeiro(fieldErrors.sobre),
        consentimento: primeiro(fieldErrors.consentimento),
      },
      values,
    };
  }

  const resultado = await salvarInscricao({
    ...parsed.data,
    consentimento: { em: new Date().toISOString(), versao: consentimentoInscricao.versao },
  });

  if (!resultado.ok) {
    return {
      status: "error",
      message:
        resultado.motivo === "indisponivel"
          ? "As inscrições abrem em breve. Nenhum dado foi guardado."
          : "Não foi possível enviar agora. Tente de novo em alguns minutos.",
      values,
    };
  }
  if (resultado.teste) {
    return {
      status: "success",
      message:
        "Inscrição de teste aceita. O envio ainda não está configurado, então nada foi guardado.",
    };
  }
  return {
    status: "success",
    message: `Inscrição recebida, ${parsed.data.nome}. A equipe do Mural vai responder no e-mail informado.`,
  };
}
