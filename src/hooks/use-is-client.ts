"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true no navegador depois da hidratação; false no servidor (sem setState em efeito). */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
