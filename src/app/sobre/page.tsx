import type { Metadata } from "next";
import Link from "next/link";

import { JoinDialog } from "@/components/community/join-dialog";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { sections } from "@/lib/navigation";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Sobre o Instituto",
  description: siteConfig.mission,
  alternates: { canonical: sections.sobre.href },
};

const principios = [
  {
    titulo: "Fontes verificáveis",
    texto:
      "Cada artigo, verbete e ficha de livro indica de onde vem a informação. Datas, edições e traduções que ainda não foram confirmadas aparecem marcadas como a conferir, até a revisão humana.",
  },
  {
    titulo: "Pluralidade de tradições",
    texto:
      "O acervo reúne correntes diferentes do pensamento socialista, do marxismo clássico ao pensamento decolonial, e apresenta os debates entre elas em vez de escolher um único cânone.",
  },
  {
    titulo: "A partir da periferia",
    texto:
      "Brasil, América Latina e o Sul Global não aparecem como nota de rodapé: autoras e autores da região estão no centro das trilhas, da biblioteca e da linha do tempo.",
  },
  {
    titulo: "Direitos autorais respeitados",
    texto:
      "Livros protegidos por direitos autorais aparecem só com ficha, comentário e indicação de onde encontrar. Textos integrais ficam reservados a obras em domínio público.",
  },
];

export default function SobrePage() {
  return (
    <>
      <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: sections.sobre.label }]}
          className="mb-12"
        />
        <div className="grid-page gap-y-8">
          <h1 className="col-span-12 font-display text-h1 lg:col-span-8">
            Sobre o Instituto
            <i aria-hidden className="title-mark" />
          </h1>
          <p className="col-span-12 max-w-[52ch] font-text text-lead lg:col-span-7">
            {siteConfig.mission}
          </p>
          <p className="col-span-12 max-w-[60ch] text-muted-foreground lg:col-span-7">
            O {siteConfig.name} reúne uma biblioteca comentada, trilhas de estudo, um glossário de
            conceitos e artigos de formação. O objetivo é que estudantes, professores, militantes e
            leitores em geral encontrem, num só lugar, por onde começar e como seguir estudando.
          </p>
        </div>
      </Section>

      <Section
        tone="paper"
        divider
        aria-labelledby="linha-editorial"
        id="linha-editorial"
        className="scroll-mt-[var(--header-h)]"
      >
        <div className="grid-page gap-y-stack">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="linha-editorial-titulo" className="font-display text-h2">
              Linha editorial
            </h2>
            <p className="mt-4 max-w-[40ch] text-muted-foreground">{siteConfig.editorialLine}</p>
          </div>
          <ul className="col-span-12 grid gap-x-[clamp(16px,2vw,32px)] sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {principios.map((p) => (
              <li key={p.titulo} className="border-t border-foreground pt-5 pb-stack">
                <h3 className="font-display text-h3">{p.titulo}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {p.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper" divider aria-labelledby="participar">
        <div className="grid-page gap-y-stack">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="participar" className="font-display text-h2">
              Como participar
            </h2>
          </div>
          <div className="col-span-12 grid gap-x-[clamp(16px,2vw,32px)] gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <div>
              <h3 className="font-display text-h3">Produzir conteúdo</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                Artigos, verbetes, resenhas e trilhas são feitos com quem estuda e pesquisa. Deixe
                seu contato e a equipe editorial fala com você.
              </p>
              <JoinDialog caminho="conteudo">
                <button
                  type="button"
                  className="link-underline mt-4 cursor-pointer text-sm font-medium"
                >
                  Faça parte
                </button>
              </JoinDialog>
            </div>
            <div>
              <h3 className="font-display text-h3">Expor no Mural</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                Artistas podem se inscrever na chamada aberta do Mural Cultural. A curadoria avalia
                cada inscrição, e nenhuma obra vai ao ar sem autorização por escrito.
              </p>
              <JoinDialog caminho="artista">
                <a
                  href={sections.muralChamada.href}
                  className="link-underline mt-4 inline-block text-sm font-medium"
                >
                  Inscrever meu trabalho
                </a>
              </JoinDialog>
            </div>
            <div>
              <h3 className="font-display text-h3">Acompanhar as publicações</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                A newsletter avisa sobre novos textos, trilhas e seções. Sem propaganda, e o e-mail
                não é repassado a ninguém.
              </p>
              <Link
                href="/#newsletter"
                className="link-underline mt-4 inline-block text-sm font-medium"
              >
                Assinar a newsletter
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Contato só aparece quando houver e-mail institucional (site.config.ts). */}
      {siteConfig.contactEmail ? (
        <Section tone="paper" divider aria-labelledby="contato">
          <div className="grid-page gap-y-6">
            <h2 id="contato" className="col-span-12 font-display text-h2 lg:col-span-4">
              Contato
            </h2>
            <p className="col-span-12 max-w-[56ch] text-muted-foreground lg:col-span-7 lg:col-start-6">
              Para correções, sugestões de leitura e assuntos de imprensa, escreva para{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="link-underline text-foreground"
              >
                {siteConfig.contactEmail}
              </a>
              . Sobre dados pessoais, veja a{" "}
              <Link href={sections.privacidade.href} className="link-underline text-foreground">
                Política de privacidade
              </Link>
              .
            </p>
          </div>
        </Section>
      ) : null}
    </>
  );
}
