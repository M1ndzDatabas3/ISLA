import Link from "next/link";

import { Button } from "@/components/ui/button";
import { sections } from "@/lib/navigation";

export default function NotFound() {
  return (
    <section className="container-page py-[clamp(72px,11vw,160px)]">
      <p className="font-display text-[clamp(5rem,16vw,12rem)] leading-none text-brand-text">404</p>
      <h1 className="mt-8 max-w-[20ch] font-display text-h1">
        Esta página não está no acervo
        <i aria-hidden className="title-mark" />
      </h1>
      <p className="mt-6 max-w-[46ch] font-text text-lead text-muted-foreground">
        O endereço pode ter mudado ou a seção ainda não foi publicada. Procure pelo tema ou volte ao
        início.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-7">
        <Button asChild>
          <Link href={sections.busca.href}>Buscar no site</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </section>
  );
}
