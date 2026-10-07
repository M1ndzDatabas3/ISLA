import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { getMarcos } from "@/lib/content";
import { sections } from "@/lib/navigation";
import { labelOf } from "@/lib/taxonomy";

import { TimelineTrack } from "./timeline-track";

/** Prévia da linha do tempo: sete marcos, do Manifesto ao MST. */
export function TimelinePreview() {
  const marcos = getMarcos().slice(0, 7);
  if (marcos.length < 3) return null;

  return (
    <Section tone="paper" divider>
      <SectionHeading
        title="Linha do tempo"
        description="Revoluções, fundações e rupturas, com atenção ao que aconteceu na América Latina."
        action={{ label: "Ver a linha do tempo", href: sections.linhaDoTempo.href }}
      />
      <TimelineTrack>
        <ol className="flex flex-col gap-9 pl-8 lg:grid lg:grid-cols-7 lg:gap-x-5 lg:pl-0">
          {marcos.map((m) => (
            <li key={m.slug} className="relative lg:pt-9">
              <span
                data-dot
                aria-hidden
                className="absolute top-[0.45em] -left-8 size-[11px] border border-foreground bg-red lg:top-0 lg:left-0"
              />
              <p className="font-display text-[1.75rem] leading-none tabular-nums lg:text-[2rem]">
                {m.ano}
              </p>
              <h3 className="mt-3 text-base leading-snug font-medium">{m.titulo}</h3>
              <p className="mt-1 text-meta text-muted-foreground">{labelOf("regiao", m.regiao)}</p>
            </li>
          ))}
        </ol>
      </TimelineTrack>
    </Section>
  );
}
