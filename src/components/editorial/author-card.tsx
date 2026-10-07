import Image from "next/image";
import Link from "next/link";

import { formatLifespan } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface AuthorCardData {
  href: string;
  nome: string;
  nascimento?: number;
  morte?: number;
  nacionalidade: string;
  tradicoes: string[];
  retrato?: { src: string; alt: string } | null;
}

const particulas = new Set(["de", "da", "do", "das", "dos", "e", "van", "von", "der", "y"]);
const sufixos = new Set(["júnior", "junior", "jr.", "filho", "neto", "sobrinho"]);

/** Iniciais do primeiro e do último nome, sem partículas ("Theotonio dos Santos" → "TS"). */
export function initialsOf(nome: string) {
  const partes = nome
    .split(/\s+/)
    .filter((p) => p && !particulas.has(p.toLowerCase()) && !sufixos.has(p.toLowerCase()));
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

/** Retrato em duotone ou, sem retrato licenciado, as iniciais numa moldura fina. */
export function AuthorPortrait({
  nome,
  retrato,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  nome: string;
  retrato?: { src: string; alt: string } | null;
  className?: string;
  sizes?: string;
}) {
  if (retrato) {
    return (
      <div className={cn("duotone relative aspect-[4/5]", className)}>
        <Image src={retrato.src} alt={retrato.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={cn("relative aspect-[4/5] overflow-hidden border border-hair", className)}
    >
      <span className="absolute top-4 right-4 size-2.5 bg-red" />
      <span className="absolute bottom-3 left-4 font-display text-[clamp(3.5rem,8vw,6rem)] leading-none transition-colors group-hover:text-brand-text">
        {initialsOf(nome)}
      </span>
    </div>
  );
}

/** Miniatura quadrada: retrato em duotone ou iniciais numa moldura fina. */
export function AuthorThumb({
  nome,
  retrato,
  className,
}: {
  nome: string;
  retrato?: { src: string; alt: string } | null;
  className?: string;
}) {
  return retrato ? (
    <div className={cn("duotone relative aspect-square", className)}>
      <Image src={retrato.src} alt="" fill sizes="80px" className="object-cover object-top" />
    </div>
  ) : (
    <div
      aria-hidden
      className={cn(
        "flex aspect-square items-center justify-center border border-hair font-display text-[1.375rem] leading-none transition-colors group-hover:border-foreground",
        className,
      )}
    >
      {initialsOf(nome)}
    </div>
  );
}

/** Linha do diretório de autores: miniatura, nome, datas e tradições. */
export function AuthorRow({ author, className }: { author: AuthorCardData; className?: string }) {
  return (
    <article
      className={cn(
        "group relative grid grid-cols-[64px_1fr] items-center gap-4 border-t border-hair py-5 sm:grid-cols-[72px_1fr]",
        className,
      )}
    >
      <AuthorThumb nome={author.nome} retrato={author.retrato} />
      <div className="min-w-0">
        <h3 className="font-display text-[1.375rem] leading-tight transition-colors group-hover:text-brand-text">
          <Link href={author.href} className="after:absolute after:inset-0 after:content-['']">
            {author.nome}
          </Link>
        </h3>
        <p className="mt-1 text-meta text-muted-foreground">
          <span className="tabular-nums">{formatLifespan(author.nascimento, author.morte)}</span>,{" "}
          {author.nacionalidade}
        </p>
        <p className="mt-0.5 truncate text-meta text-muted-foreground">
          {author.tradicoes.join(", ")}
        </p>
      </div>
    </article>
  );
}

export function AuthorCard({ author, className }: { author: AuthorCardData; className?: string }) {
  return (
    <article className={cn("group relative flex flex-col gap-2", className)}>
      <AuthorPortrait nome={author.nome} retrato={author.retrato} className="mb-3" />
      <h3 className="font-display text-[1.375rem] leading-tight">
        <Link href={author.href} className="after:absolute after:inset-0 after:content-['']">
          {author.nome}
        </Link>
      </h3>
      <p className="text-meta text-muted-foreground">
        <span className="tabular-nums">{formatLifespan(author.nascimento, author.morte)}</span>,{" "}
        {author.nacionalidade}
      </p>
      <p className="text-meta">{author.tradicoes.join(", ")}</p>
    </article>
  );
}
