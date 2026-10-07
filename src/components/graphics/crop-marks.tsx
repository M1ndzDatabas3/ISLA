import { cn } from "@/lib/utils";

/** Marcas de corte finas nos quatro cantos, afastadas da imagem (prancha de arquivo). */
export function CropMarks({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const line = "absolute bg-foreground/30";
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute -inset-[14px] lg:-inset-[18px]", className)}
      style={style}
    >
      <span className={`${line} top-[14px] left-0 h-px w-[9px] lg:top-[18px] lg:w-[12px]`} />
      <span className={`${line} top-0 left-[14px] h-[9px] w-px lg:left-[18px] lg:h-[12px]`} />
      <span className={`${line} top-[14px] right-0 h-px w-[9px] lg:top-[18px] lg:w-[12px]`} />
      <span className={`${line} top-0 right-[14px] h-[9px] w-px lg:right-[18px] lg:h-[12px]`} />
      <span className={`${line} bottom-[14px] left-0 h-px w-[9px] lg:bottom-[18px] lg:w-[12px]`} />
      <span className={`${line} bottom-0 left-[14px] h-[9px] w-px lg:left-[18px] lg:h-[12px]`} />
      <span className={`${line} right-0 bottom-[14px] h-px w-[9px] lg:bottom-[18px] lg:w-[12px]`} />
      <span className={`${line} right-[14px] bottom-0 h-[9px] w-px lg:right-[18px] lg:h-[12px]`} />
    </span>
  );
}
