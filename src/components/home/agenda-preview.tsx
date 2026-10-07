import { SectionHeading } from "@/components/editorial/section-heading";
import { Section } from "@/components/layout/section";
import { ExampleBadge } from "@/components/ui/example-badge";
import { getProximosEventos } from "@/lib/content";
import { sections } from "@/lib/navigation";

const tipos: Record<string, string> = {
  curso: "Curso",
  "grupo-de-leitura": "Grupo de leitura",
  debate: "Debate",
  lancamento: "Lançamento",
  "aula-aberta": "Aula aberta",
};

const dia = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Sao_Paulo" });
const mes = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Sao_Paulo" });
const semanaHora = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/** Próximos eventos (horário de Brasília). */
export function AgendaPreview() {
  const eventos = getProximosEventos();
  if (!eventos.length) return null;

  return (
    <Section tone="paper" divider>
      <SectionHeading
        title="Agenda"
        description="Cursos, grupos de leitura e debates, presenciais e online. Horários de Brasília."
        action={{ label: "Agenda completa", href: sections.agenda.href }}
      />
      <ol className="border-t border-hair">
        {eventos.map((evento) => {
          const data = new Date(evento.inicio);
          return (
            <li
              key={evento.slug}
              className="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-2 border-b border-hair py-6 lg:grid-cols-[7rem_1fr_16rem] lg:items-baseline"
            >
              <time dateTime={evento.inicio} className="row-span-2 flex flex-col lg:row-span-1">
                <span className="font-display text-[2.25rem] leading-none tabular-nums">
                  {dia.format(data)}
                </span>
                <span className="mt-1 text-meta text-muted-foreground">
                  {mes.format(data).replace(".", "")}
                </span>
              </time>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-meta font-medium text-brand-text">
                    {tipos[evento.tipo]}
                  </span>
                  {evento.exemplo ? <ExampleBadge /> : null}
                </div>
                <h3 className="mt-2 font-display text-[1.375rem] leading-tight">{evento.titulo}</h3>
                <p className="mt-2 hidden max-w-[60ch] text-sm text-muted-foreground sm:block">
                  {evento.descricao}
                </p>
              </div>
              <p className="text-sm text-muted-foreground lg:text-right">
                <span className="inline-block first-letter:uppercase">
                  {semanaHora.format(data).replace(",", ", às")}
                </span>
                <br />
                {evento.local}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
