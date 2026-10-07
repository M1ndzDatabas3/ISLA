"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  abrirPreferenciasDeCookies,
  ouvirPedidoDePreferencias,
  salvarConsentimento,
  useConsentimento,
} from "@/lib/consent";
import { sections } from "@/lib/navigation";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Aviso de cookies e preferências. Recusar tem o mesmo peso visual que aceitar,
 * nada opcional roda antes da escolha e a medição só carrega com consentimento.
 */
export function CookieConsent() {
  const consentimento = useConsentimento();
  const [preferencias, setPreferencias] = useState(false);

  useEffect(() => ouvirPedidoDePreferencias(() => setPreferencias(true)), []);

  const decidir = (medicao: boolean) => {
    const revogou = consentimento?.medicao === true && !medicao;
    salvarConsentimento(medicao);
    setPreferencias(false);
    // O script de medição já carregado só sai da página recarregando.
    if (revogou && plausibleDomain) window.location.reload();
  };

  return (
    <>
      {consentimento?.medicao && plausibleDomain ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      ) : null}

      {consentimento === null && !preferencias ? (
        <section
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-40 border-t border-hair bg-background pb-[env(safe-area-inset-bottom)] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:max-w-md lg:border lg:pb-0 lg:shadow-overlay"
        >
          <div className="flex flex-col gap-4 p-5 lg:p-6">
            <p className="text-sm leading-relaxed">
              Usamos só o armazenamento necessário para o site funcionar. Com a sua permissão,
              também contamos visitas de forma anônima, sem cookies de rastreamento.{" "}
              <Link
                href={sections.privacidade.href}
                className="underline underline-offset-2 hover:text-brand-text"
              >
                Política de privacidade
              </Link>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => decidir(false)}>
                Recusar
              </Button>
              <Button variant="outline" size="sm" onClick={() => decidir(true)}>
                Aceitar
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setPreferencias(true)}
              className="self-start text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Escolher o que permitir
            </button>
          </div>
        </section>
      ) : null}

      <Dialog open={preferencias} onOpenChange={setPreferencias}>
        <DialogContent>
          <PreferenciasForm medicaoAtual={consentimento?.medicao ?? false} onSalvar={decidir} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreferenciasForm({
  medicaoAtual,
  onSalvar,
}: {
  medicaoAtual: boolean;
  onSalvar: (medicao: boolean) => void;
}) {
  const [medicao, setMedicao] = useState(medicaoAtual);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Preferências de cookies</DialogTitle>
        <DialogDescription>
          Você pode mudar de ideia quando quiser pelo link no rodapé do site.
        </DialogDescription>
      </DialogHeader>
      <ul className="flex flex-col border-t border-hair">
        <li className="flex items-start gap-4 border-b border-hair py-4">
          <input
            id="cookie-necessarios"
            type="checkbox"
            checked
            disabled
            className="mt-0.5 size-5 shrink-0 accent-brand"
          />
          <label htmlFor="cookie-necessarios" className="flex flex-col gap-1">
            <span className="text-sm font-medium">Necessários (sempre ativos)</span>
            <span className="text-sm text-muted-foreground">
              Guardam no seu navegador o tema escolhido e esta decisão. Nada é enviado a terceiros.
            </span>
          </label>
        </li>
        <li className="flex items-start gap-4 border-b border-hair py-4">
          <input
            id="cookie-medicao"
            type="checkbox"
            checked={medicao}
            onChange={(e) => setMedicao(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
          />
          <label htmlFor="cookie-medicao" className="flex cursor-pointer flex-col gap-1">
            <span className="text-sm font-medium">Medição de audiência</span>
            <span className="text-sm text-muted-foreground">
              Conta páginas vistas de forma agregada, sem cookies e sem identificar você.
            </span>
          </label>
        </li>
      </ul>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onSalvar(false)}>
          Recusar tudo
        </Button>
        <Button size="sm" onClick={() => onSalvar(medicao)}>
          Salvar escolhas
        </Button>
      </DialogFooter>
    </>
  );
}

/** Link do rodapé que reabre as preferências. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={abrirPreferenciasDeCookies} className={className}>
      Preferências de cookies
    </button>
  );
}
