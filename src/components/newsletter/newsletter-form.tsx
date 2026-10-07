"use client";

import Link from "next/link";
import { startTransition, useActionState, useId } from "react";

import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sections } from "@/lib/navigation";
import { consentimentoNewsletter, type NewsletterState } from "@/lib/newsletter-consent";
import { cn } from "@/lib/utils";

const inicial: NewsletterState = { status: "idle" };
const [consentimentoAntes, consentimentoDepois] =
  consentimentoNewsletter.texto.split("Política de privacidade");

/**
 * Inscrição na newsletter. Funciona sem JavaScript (Server Action); a caixa de
 * consentimento começa desmarcada e é obrigatória (LGPD).
 */
export function NewsletterForm({
  origem = "site",
  className,
}: {
  origem?: string;
  className?: string;
}) {
  const [state, action, pending] = useActionState(subscribeToNewsletter, inicial);
  const id = useId();
  const erros = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <div role="status" className={cn("border-l-2 border-brand py-2 pl-5", className)}>
        <p className="font-display text-h3">Quase lá</p>
        <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        // Sem o reset automático: e-mail e consentimento continuam marcados se houver erro.
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate
      className={cn("flex flex-col gap-5", className)}
    >
      <input type="hidden" name="origem" value={origem} />
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-site`}>Não preencha este campo</label>
        <input id={`${id}-site`} name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          E-mail
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nome@exemplo.org"
            defaultValue={state.status === "error" ? state.values?.email : undefined}
            aria-invalid={erros?.email ? true : undefined}
            aria-describedby={erros?.email ? `${id}-email-erro` : undefined}
            className="sm:flex-1"
          />
          <Button type="submit" disabled={pending} className="sm:w-auto">
            {pending ? "Enviando…" : "Assinar"}
          </Button>
        </div>
        {erros?.email ? (
          <p id={`${id}-email-erro`} className="text-sm text-brand-text">
            {erros.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            id={`${id}-consentimento`}
            name="consentimento"
            type="checkbox"
            aria-invalid={erros?.consentimento ? true : undefined}
            aria-describedby={erros?.consentimento ? `${id}-consentimento-erro` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
          />
          <label
            htmlFor={`${id}-consentimento`}
            className="max-w-[56ch] text-sm leading-snug text-muted-foreground"
          >
            {consentimentoAntes}
            <Link
              href={sections.privacidade.href}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Política de privacidade
            </Link>
            {consentimentoDepois}
          </label>
        </div>
        {erros?.consentimento ? (
          <p id={`${id}-consentimento-erro`} className="text-sm text-brand-text">
            {erros.consentimento}
          </p>
        ) : null}
      </div>

      <p aria-live="polite" className="text-sm empty:hidden">
        {state.status === "error" && !erros ? state.message : ""}
      </p>
    </form>
  );
}
