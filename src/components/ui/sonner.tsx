"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Toasts no estilo da plataforma: borda tinta, sombra chapada, sem cantos. */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      mobileOffset={{ bottom: "calc(var(--bottom-nav-h) + 16px)" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 border border-hair bg-popover p-4 font-sans text-sm text-popover-foreground shadow-overlay sm:w-[360px]",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton: "ml-auto shrink-0 border border-foreground px-3 py-1 font-medium",
          success: "[&_[data-icon]]:text-brand-text",
          error: "border-l-2 border-l-brand",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
