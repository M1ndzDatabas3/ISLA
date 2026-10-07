"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { DARK_QUERY, THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const listeners = new Set<() => void>();

/** Sem escolha registrada, o site abre no tema claro. */
function readStored(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "system" ? value : "light";
  } catch {
    return "light";
  }
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Snapshot como string para ser estável entre renderizações.
const getSnapshot = () => {
  const theme = readStored();
  return `${theme}:${resolve(theme)}`;
};
const getServerSnapshot = () => "light:light";

/** Cor da barra do navegador no celular acompanha o tema escolhido. */
function syncThemeColor(resolved: ResolvedTheme) {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", resolved === "dark" ? "#0A0A0A" : "#FFFFFF"));
}

function applyToDocument(resolved: ResolvedTheme) {
  const root = document.documentElement;
  // Desliga transições durante a troca para nada "deslizar" de uma cor à outra.
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  syncThemeColor(resolved);
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [theme, resolvedTheme] = snapshot.split(":") as [Theme, ResolvedTheme];

  // Mantém a classe do <html> em dia quando o sistema muda ou outra aba troca o tema.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark !== (resolvedTheme === "dark")) applyToDocument(resolvedTheme);
    else syncThemeColor(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      // "light" é o padrão: não precisa ficar guardado.
      if (next === "light") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Armazenamento bloqueado: o tema vale só para esta visita.
    }
    applyToDocument(resolve(next));
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme precisa estar dentro de <ThemeProvider>.");
  return context;
}
