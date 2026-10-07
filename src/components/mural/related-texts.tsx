import Link from "next/link";

import type { TextoRelacionado } from "@/lib/mural";

/** Artigos, trilhas, verbetes e livros do Instituto ligados a uma obra ou artista. */
export function RelatedTexts({ textos }: { textos: TextoRelacionado[] }) {
  return (
    <ul className="grid gap-x-[clamp(16px,2vw,32px)] sm:grid-cols-2 lg:grid-cols-4">
      {textos.map((t) => (
        <li key={t.href} className="group relative border-t border-hair pt-4 pb-6">
          <p className="text-meta font-medium text-brand-text">{t.tipo}</p>
          <h3 className="mt-1.5 font-display text-[1.25rem] leading-tight transition-colors group-hover:text-brand-text">
            <Link href={t.href} className="after:absolute after:inset-0 after:content-['']">
              {t.titulo}
            </Link>
          </h3>
        </li>
      ))}
    </ul>
  );
}
