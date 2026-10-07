/** Constantes do tema compartilhadas entre o script inline (servidor) e o provider (cliente). */

export const THEME_STORAGE_KEY = "tema";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Executado no <head> antes da primeira pintura, para não piscar o tema errado.
 * Padrão: claro. Escuro só por escolha ("dark") ou se a pessoa escolheu seguir o
 * sistema ("system") e o sistema está escuro. Mantenha igual a readStored()/resolve()
 * em theme-provider.tsx.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t==="system"&&window.matchMedia("${DARK_QUERY}").matches);var e=document.documentElement;e.classList.add("js");e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;
