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

/** Iniciais do nome (sem partículas como "de", "dos"). */
export function initialsOf(nome: string) {
  return nome
    .split(" ")
    .filter((part) => part.length > 2)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
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
