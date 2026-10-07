"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useId, useState } from "react";

import { inscreverNoMural } from "@/app/actions/mural";
import { CityCombobox } from "@/components/community/city-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { estados, type SiglaUF } from "@/lib/estados";
import { formatarWhatsapp } from "@/lib/interesse-consent";
import {
  consentimentoInscricao,
  type InscricaoCampo,
  type InscricaoState,
} from "@/lib/mural/inscricao-consent";
import { sections } from "@/lib/navigation";
import { linguagensArtisticas } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export const inscricaoInicial: InscricaoState = { status: "idle" };
const [consentimentoAntes, consentimentoDepois] =
  consentimentoInscricao.texto.split("Política de privacidade");

const campoBase =
  "w-full border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-brand-text";

/** Inscrição na chamada aberta. Funciona sem JavaScript (Server Action); sem upload de arquivos. */
export function ChamadaForm() {
  const [state, action, pending] = useActionState(inscreverNoMural, inscricaoInicial);
  return <ChamadaFields state={state} action={action} pending={pending} />;
}

interface ChamadaFieldsProps {
  state: InscricaoState;
  action: (data: FormData) => void;
  pending: boolean;
  /** Versão do modal Participe: campos mais baixos e botão no tamanho padrão. */
  compact?: boolean;
}

/** Campos da inscrição. O estado vem de fora para o modal Participe reaproveitar o formulário. */
export function ChamadaFields({ state, action, pending, compact = false }: ChamadaFieldsProps) {
  const id = useId();
  const erros = state.status === "error" ? state.fieldErrors : undefined;
  const valores = state.status === "error" ? state.values : undefined;
  const valor = (k: string) =>
    typeof valores?.[k] === "string" ? (valores[k] as string) : undefined;
  const [uf, setUf] = useState<SiglaUF | "EX" | "">((valor("uf") as SiglaUF) ?? "");
  const [cidade, setCidade] = useState(valor("cidade") ?? "");
  const [whatsapp, setWhatsapp] = useState(valor("whatsapp") ?? "");

  const props = (nome: InscricaoCampo) => ({
    id: `${id}-${nome}`,
    name: nome,
    "aria-invalid": erros?.[nome] ? true : undefined,
    "aria-describedby": erros?.[nome] ? `${id}-${nome}-erro` : undefined,
  });
  const erro = (nome: InscricaoCampo) =>
    erros?.[nome] ? (
      <p id={`${id}-${nome}-erro`} className="text-sm text-brand-text">
        {erros[nome]}
      </p>
    ) : null;
  const rotulo = (nome: InscricaoCampo, texto: string, extra?: string) => (
    <label htmlFor={`${id}-${nome}`} className="text-sm font-medium">
      {texto}
      {extra ? <span className="font-normal text-muted-foreground"> {extra}</span> : null}
    </label>
  );

  if (state.status === "success") {
    return (
      <div role="status" className="border-l-2 border-brand py-2 pl-5">
        <p className="font-display text-h3">Inscrição enviada</p>
        <p className="mt-2 max-w-[52ch] text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate
      className={cn("flex flex-col", compact ? "gap-6" : "gap-7")}
    >
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-site`}>Não preencha este campo</label>
        <input id={`${id}-site`} name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          {rotulo("nome", "Nome artístico")}
          <Input {...props("nome")} autoComplete="nickname" defaultValue={valor("nome")} />
          {erro("nome")}
        </div>
        <div className="flex flex-col gap-2">
          {rotulo("email", "E-mail")}
          <Input
            {...props("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={valor("email")}
          />
          {erro("email")}
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          {rotulo("whatsapp", "WhatsApp", "(opcional, com DDD)")}
          <Input
            {...props("whatsapp")}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 91234-5678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
          />
          {erro("whatsapp")}
        </div>
        <div className="flex flex-col gap-2">
          {rotulo("uf", "Estado")}
          <div className="relative">
            <select
              {...props("uf")}
              value={uf}
              onChange={(e) => {
                setUf(e.target.value as SiglaUF | "EX" | "");
                setCidade("");
              }}
              className={cn(
                campoBase,
                "h-12 cursor-pointer appearance-none pr-10",
                !uf && "text-muted-foreground",
              )}
            >
              <option value="" disabled>
                Escolha o estado
              </option>
              {estados.map((e) => (
                <option key={e.sigla} value={e.sigla} className="text-foreground">
                  {e.nome}
                </option>
              ))}
              <option value="EX" className="text-foreground">
                Moro fora do Brasil
              </option>
            </select>
            <ChevronDown
              aria-hidden
              strokeWidth={1.5}
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            />
          </div>
          {erro("uf")}
        </div>
        <div className="flex flex-col gap-2">
          {rotulo("cidade", uf === "EX" ? "Cidade e país" : "Cidade")}
          {uf === "EX" ? (
            <Input
              {...props("cidade")}
              placeholder="Valparaíso, Chile"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          ) : (
            <CityCombobox
              id={`${id}-cidade`}
              name="cidade"
              uf={uf}
              value={cidade}
              onChange={setCidade}
              invalid={Boolean(erros?.cidade)}
              describedBy={erros?.cidade ? `${id}-cidade-erro` : undefined}
            />
          )}
          {erro("cidade")}
        </div>
      </div>

      <fieldset aria-describedby={erros?.linguagens ? `${id}-linguagens-erro` : undefined}>
        <legend className="mb-3 text-sm font-medium">
          Linguagens{" "}
          <span className="font-normal text-muted-foreground">(marque todas as que usa)</span>
        </legend>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {linguagensArtisticas.map((l) => (
            <label key={l.slug} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="linguagens"
                value={l.slug}
                defaultChecked={
                  Array.isArray(valores?.linguagens) && valores.linguagens.includes(l.slug)
                }
                className="size-5 shrink-0 cursor-pointer accent-brand"
              />
              {l.label}
            </label>
          ))}
        </div>
        <div className="mt-2">{erro("linguagens")}</div>
      </fieldset>

      <div className="flex flex-col gap-2">
        {rotulo(
          "links",
          "Links do portfólio",
          "(Instagram, site, Behance, Bandcamp… um por linha)",
        )}
        <textarea
          {...props("links")}
          rows={3}
          placeholder={"https://instagram.com/seu.perfil\nhttps://seusite.com.br"}
          defaultValue={valor("links")}
          className={cn(campoBase, "resize-y py-3")}
        />
        {erro("links")}
      </div>

      <div className="flex flex-col gap-2">
        {rotulo("sobre", "Sobre o seu trabalho", "(até 1.000 caracteres)")}
        <textarea
          {...props("sobre")}
          rows={compact ? 4 : 5}
          maxLength={1000}
          placeholder="O que você faz, com que materiais, sobre quais temas, onde o trabalho circula."
          defaultValue={valor("sobre")}
          className={cn(campoBase, "resize-y py-3")}
        />
        {erro("sobre")}
      </div>

      <div className="flex flex-col gap-2 border-t border-hair pt-5">
        <div className="flex items-start gap-3">
          <input
            {...props("consentimento")}
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
          />
          <label
            htmlFor={`${id}-consentimento`}
            className="text-sm leading-snug text-muted-foreground"
          >
            {consentimentoAntes}
            <Link
              href={`${sections.privacidade.href}#mural`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Política de privacidade
            </Link>
            {consentimentoDepois}
          </label>
        </div>
        {erro("consentimento")}
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={cn("text-sm", state.status === "error" && "text-brand-text")}
        >
          {state.status === "error" ? state.message : ""}
        </p>
        <Button type="submit" size={compact ? "md" : "lg"} disabled={pending}>
          {pending ? "Enviando…" : "Enviar inscrição"}
        </Button>
      </div>
    </form>
  );
}
