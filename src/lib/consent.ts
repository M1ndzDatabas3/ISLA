"use client";

/**
 * Consentimento de cookies e medição (LGPD). Sem escolha registrada, vale a
 * opção mais privada: só o armazenamento necessário (tema e esta própria escolha).
 */
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "isla-consentimento";
const VERSAO = 1;
const EVENTO = "isla:consentimento";
const EVENTO_PREFERENCIAS = "isla:preferencias-de-cookies";

export interface Consentimento {
  medicao: boolean;
  /** ISO da decisão, para registro. */
  em: string;
  versao: number;
}

let cacheBruto: string | null | undefined;
let cache: Consentimento | null = null;

function ler(): Consentimento | null {
  let bruto: string | null = null;
  try {
    bruto = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (bruto === cacheBruto) return cache;
  cacheBruto = bruto;
  try {
    const valor = bruto ? (JSON.parse(bruto) as Consentimento) : null;
    cache = valor && valor.versao === VERSAO ? valor : null;
  } catch {
    cache = null;
  }
  return cache;
}

function assinar(callback: () => void) {
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}

/** `undefined` no servidor; `null` quando ainda não há escolha. */
export function useConsentimento(): Consentimento | null | undefined {
  return useSyncExternalStore(assinar, ler, () => undefined);
}

export function salvarConsentimento(medicao: boolean) {
  const valor: Consentimento = { medicao, em: new Date().toISOString(), versao: VERSAO };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valor));
  } catch {
    // Sem armazenamento (navegação privada restrita): a escolha vale só nesta página.
    cacheBruto = JSON.stringify(valor);
    cache = valor;
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Abre o painel de preferências de qualquer lugar (ex.: link no rodapé). */
export function abrirPreferenciasDeCookies() {
  window.dispatchEvent(new Event(EVENTO_PREFERENCIAS));
}

export function ouvirPedidoDePreferencias(callback: () => void) {
  window.addEventListener(EVENTO_PREFERENCIAS, callback);
  return () => window.removeEventListener(EVENTO_PREFERENCIAS, callback);
}
