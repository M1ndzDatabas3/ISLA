"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

/** Botão do header: alterna entre claro e escuro. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={cn(
        "inline-flex size-11 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Sun className="hidden size-4.5 dark:block" strokeWidth={1.5} aria-hidden />
      <Moon className="size-4.5 dark:hidden" strokeWidth={1.5} aria-hidden />
      <span className="sr-only">
        {next === "dark" ? "Ativar tema escuro" : "Ativar tema claro"}
      </span>
    </button>
  );
}

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Claro", Icon: Sun },
  { value: "system", label: "Sistema", Icon: Monitor },
  { value: "dark", label: "Escuro", Icon: Moon },
];

/** Seletor de três estados (rodapé e menu mobile). */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Tema" className={cn("inline-flex gap-1", className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 border border-hair px-3 font-sans text-meta text-muted-foreground transition-colors hover:text-foreground aria-pressed:border-foreground aria-pressed:text-foreground"
        >
          <Icon className="size-3.5" strokeWidth={1.5} aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
