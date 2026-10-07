"use client";

/**
 * Registro central do GSAP. Importe gsap, ScrollTrigger e useGSAP sempre daqui.
 * Plugins pesados (SplitText, Flip, DrawSVGPlugin) são registrados no componente
 * que os usa, para não pesar no bundle de todas as páginas.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion } from "@/lib/tokens";

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

CustomEase.create(motion.ease, motion.easeCurve);

gsap.defaults({ ease: motion.ease, duration: motion.duration.base });

// Evita recalcular tudo quando a barra de endereço do celular aparece e some.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Condições do gsap.matchMedia() usadas em todo o projeto. */
export const mediaConditions = {
  isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  isMobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
