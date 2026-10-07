import { conferirLabel, isConferir, splitConferir } from "@/lib/conferir";
import { cn } from "@/lib/utils";

const titulo = "Dado em revisão editorial: será confirmado antes da versão definitiva.";

/** Etiqueta discreta para dado em revisão (estilo `.conferir-mark` em globals.css). */
export function ConferirMark({
  label = "a conferir",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span title={titulo} className={cn("conferir-mark", className)}>
      {label}
    </span>
  );
}

/** Nota de revisão de uma citação ("[CONFERIR tradução]"); texto comum passa direto. */
export function ConferirNote({ nota, className }: { nota: string; className?: string }) {
  return isConferir(nota) ? (
    <ConferirMark label={conferirLabel(nota.trim())} className={className} />
  ) : (
    <span className={className}>{nota}</span>
  );
}

/** Texto com eventuais marcas [CONFERIR] trocadas pela etiqueta. */
export function WithConferir({ text }: { text: string }) {
  return (
    <>
      {splitConferir(text).map((part, i) =>
        part.kind === "text" ? (
          <span key={i}>{part.value}</span>
        ) : (
          <ConferirMark key={i} label={part.label} />
        ),
      )}
    </>
  );
}
