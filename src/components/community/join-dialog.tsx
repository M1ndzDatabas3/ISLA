"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Slot } from "radix-ui";
import { startTransition, useActionState, useId, useRef, useState } from "react";

import { registerInterest } from "@/app/actions/interesse";
import { inscreverNoMural } from "@/app/actions/mural";
import { ChamadaFields, inscricaoInicial } from "@/components/mural/chamada-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { estados, type SiglaUF } from "@/lib/estados";
import {
  consentimentoInteresse,
  formatarWhatsapp,
  type InteresseCampo,
  type InteresseState,
} from "@/lib/interesse-consent";
import { sections } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { CityCombobox } from "./city-combobox";

const inicial: InteresseState = { status: "idle" };
const [consentimentoAntes, consentimentoDepois] =
  consentimentoInteresse.texto.split("Política de privacidade");

export type Caminho = "conteudo" | "artista";

const caminhos: { value: Caminho; titulo: string; descricao: string }[] = [
  {
    value: "conteudo",
    titulo: "Produzir conteúdo",
    descricao: "Artigos, verbetes, resenhas e trilhas de estudo, com a equipe editorial.",
  },
  {
    value: "artista",
    titulo: "Mostrar minha obra no Mural",
    descricao: "Para artistas que querem expor e fazer circular o próprio trabalho.",
  },
];

/**
 * Modal "Participe": dois caminhos, produzir conteúdo com a equipe editorial
 * ou se inscrever como artista no Mural Cultural (o mesmo formulário da
 * chamada aberta). O gatilho pode ser um link de verdade (ex.: /sobre#participar):
 * com JavaScript o clique abre o modal; sem ele, ou para buscadores, o link leva à página.
 */
export function JoinDialog({
  children,
  caminho,
}: {
  children: React.ReactNode;
  /** Caminho já escolhido ao abrir (ex.: "conteudo" na página Publique). */
  caminho?: Caminho;
}) {
  const [open, setOpen] = useState(false);
  // A cada abertura, um formulário novo (sem o estado do envio anterior).
  const [rodada, setRodada] = useState(0);
  /** Quem abriu o modal recebe o foco de volta ao fechar (sem DialogTrigger, o Radix não sabe). */
  const gatilho = useRef<HTMLElement | null>(null);

  return (
    <>
      <Slot.Root
        aria-haspopup="dialog"
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          // Ctrl/⌘ + clique ainda abre o link em outra aba.
          if (event.metaKey || event.ctrlKey || event.shiftKey) return;
          event.preventDefault();
          gatilho.current = event.currentTarget;
          setRodada((r) => r + 1);
          setOpen(true);
        }}
      >
        {children}
      </Slot.Root>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-2xl"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            gatilho.current?.focus({ preventScroll: true });
          }}
        >
          <Participe key={rodada} inicial={caminho} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Participe({ inicial: caminhoInicial }: { inicial?: Caminho }) {
  const [caminho, setCaminho] = useState<Caminho | null>(caminhoInicial ?? null);
  const [contato, enviarContato, enviandoContato] = useActionState(registerInterest, inicial);
  const [inscricao, enviarInscricao, enviandoInscricao] = useActionState(
    inscreverNoMural,
    inscricaoInicial,
  );
  const id = useId();

  const sucesso =
    contato.status === "success"
      ? { titulo: "Contato enviado", mensagem: contato.message }
      : inscricao.status === "success"
        ? { titulo: "Inscrição enviada", mensagem: inscricao.message }
        : null;

  if (sucesso) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{sucesso.titulo}</DialogTitle>
          <DialogDescription role="status">{sucesso.mensagem}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Fechar
            </Button>
          </DialogClose>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Participe</DialogTitle>
        <DialogDescription>
          Escolha como quer participar e deixe seu contato. A equipe do Instituto responde por
          e-mail ou WhatsApp.
        </DialogDescription>
      </DialogHeader>

      <fieldset>
        <legend className="sr-only">Como você quer participar?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {caminhos.map((c) => {
            const ativo = caminho === c.value;
            return (
              <label
                key={c.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-1.5 border p-4 transition-colors sm:p-5",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                  ativo ? "border-foreground" : "border-input hover:border-foreground",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-caminho`}
                  value={c.value}
                  checked={ativo}
                  onChange={() => setCaminho(c.value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-4">
                  <span className="font-display text-[1.25rem]/[1.15]">{c.titulo}</span>
                  {/* Marcador de seleção: o quadrado vermelho da marca quando escolhido. */}
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 size-3.5 shrink-0 border transition-colors",
                      ativo ? "border-brand bg-brand" : "border-input",
                    )}
                  />
                </span>
                <span className="text-sm text-muted-foreground">{c.descricao}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Os dois formulários ficam montados: trocar de caminho não apaga o que foi digitado. */}
      <div hidden={caminho !== "conteudo"}>
        <ConteudoForm state={contato} action={enviarContato} pending={enviandoContato} />
      </div>
      <div hidden={caminho !== "artista"}>
        <p className="mb-6 text-sm text-muted-foreground">
          A curadoria avalia cada inscrição, e nenhuma obra vai ao ar sem a sua autorização por
          escrito.{" "}
          <Link
            href={sections.muralChamada.href}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Leia a chamada aberta e o nosso compromisso
          </Link>
          .
        </p>
        <ChamadaFields
          compact
          state={inscricao}
          action={enviarInscricao}
          pending={enviandoInscricao}
        />
      </div>
    </>
  );
}

function ConteudoForm({
  state,
  action,
  pending,
}: {
  state: InteresseState;
  action: (data: FormData) => void;
  pending: boolean;
}) {
  const id = useId();
  const erros = state.status === "error" ? state.fieldErrors : undefined;
  const valores = state.status === "error" ? state.values : undefined;
  const [uf, setUf] = useState<SiglaUF | "">((valores?.uf as SiglaUF) ?? "");
  const [cidade, setCidade] = useState(valores?.cidade ?? "");
  const [whatsapp, setWhatsapp] = useState(valores?.whatsapp ?? "");
  const campo = (nome: InteresseCampo) => ({
    id: `${id}-${nome}`,
    name: nome,
    "aria-invalid": erros?.[nome] ? true : undefined,
    "aria-describedby": erros?.[nome] ? `${id}-${nome}-erro` : undefined,
  });
  const erro = (nome: InteresseCampo) =>
    erros?.[nome] ? (
      <p id={`${id}-${nome}-erro`} className="text-sm text-brand-text">
        {erros[nome]}
      </p>
    ) : null;

  return (
    <>
      {/* Com JavaScript, o envio não reinicia o formulário: o que foi digitado e
          escolhido continua lá se houver erro. Sem JavaScript, vale o action. */}
      <form
        action={action}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => action(data));
        }}
        noValidate
        className="flex flex-col gap-6"
      >
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-site`}>Não preencha este campo</label>
          <input id={`${id}-site`} name="site" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-nome`} className="text-sm font-medium">
              Nome
            </label>
            <Input {...campo("nome")} autoComplete="name" defaultValue={valores?.nome} />
            {erro("nome")}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              E-mail
            </label>
            <Input
              {...campo("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              defaultValue={valores?.email}
            />
            {erro("email")}
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor={`${id}-whatsapp`} className="text-sm font-medium">
              WhatsApp <span className="font-normal text-muted-foreground">(com DDD)</span>
            </label>
            <Input
              {...campo("whatsapp")}
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
            <label htmlFor={`${id}-uf`} className="text-sm font-medium">
              Estado
            </label>
            <div className="relative">
              <select
                {...campo("uf")}
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value as SiglaUF | "");
                  setCidade("");
                }}
                className={cn(
                  "h-12 w-full cursor-pointer appearance-none border border-input bg-background pr-10 pl-4 text-base outline-none",
                  "focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-brand-text",
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
            <label htmlFor={`${id}-cidade`} className="text-sm font-medium">
              Cidade
            </label>
            <CityCombobox
              id={`${id}-cidade`}
              name="cidade"
              uf={uf}
              value={cidade}
              onChange={setCidade}
              invalid={Boolean(erros?.cidade)}
              describedBy={erros?.cidade ? `${id}-cidade-erro` : undefined}
            />
            {erro("cidade")}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-mensagem`} className="text-sm font-medium">
            O que você gostaria de produzir?{" "}
            <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            {...campo("mensagem")}
            rows={3}
            maxLength={800}
            defaultValue={valores?.mensagem}
            className="w-full resize-y border border-input bg-background px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-brand-text"
          />
          {erro("mensagem")}
        </div>

        <div className="flex flex-col gap-2 border-t border-hair pt-5">
          <div className="flex items-start gap-3">
            <input
              {...campo("consentimento")}
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
            />
            <label
              htmlFor={`${id}-consentimento`}
              className="text-sm leading-snug text-muted-foreground"
            >
              {consentimentoAntes}
              <Link
                href={`${sections.privacidade.href}#faca-parte`}
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
          <Button type="submit" disabled={pending}>
            {pending ? "Enviando…" : "Enviar contato"}
          </Button>
        </div>
      </form>
    </>
  );
}
