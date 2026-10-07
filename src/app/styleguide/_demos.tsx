"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { labelOf, niveis, type Nivel } from "@/lib/taxonomy";

import { sampleBooks } from "./_samples";

export function ChipToggleDemo() {
  const options = ["Brasil", "América Latina", "Caribe", "Europa"];
  const [active, setActive] = useState<string[]>(["Brasil"]);

  return (
    <div role="group" aria-label="Filtrar por região" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip key={option} asChild>
          <button
            type="button"
            aria-pressed={active.includes(option)}
            onClick={() =>
              setActive((prev) =>
                prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
              )
            }
          >
            {option}
          </button>
        </Chip>
      ))}
    </div>
  );
}

const tradicoesDemo = [...new Set(sampleBooks.map((book) => book.tradicao))];

export function OverlayDemos() {
  const id = useId();
  const [levels, setLevels] = useState<Nivel[]>([]);
  const [traditions, setTraditions] = useState<string[]>([]);

  const count = useMemo(
    () =>
      sampleBooks.filter(
        (book) =>
          (levels.length === 0 || levels.includes(book.nivel)) &&
          (traditions.length === 0 || traditions.includes(book.tradicao)),
      ).length,
    [levels, traditions],
  );

  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="flex flex-wrap gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Abrir modal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copiar referência</DialogTitle>
            <DialogDescription>Escolha o formato da referência bibliográfica.</DialogDescription>
          </DialogHeader>
          <p className="font-text text-lg leading-relaxed">
            MARINI, Ruy Mauro. <strong>Dialética da dependência</strong>. [CONFERIR local]:
            [CONFERIR editora], [CONFERIR ano].
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="link">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() =>
                  toast.success("Referência copiada", { description: "Formato ABNT NBR 6023." })
                }
              >
                Copiar ABNT
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal aria-hidden strokeWidth={1.5} />
            Filtrar
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtrar livros</DrawerTitle>
            <DrawerDescription>No celular, os filtros da biblioteca abrem aqui.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 font-sans text-meta text-muted-foreground">
                Nível de leitura
              </legend>
              {niveis.map((nivel) => (
                <div key={nivel.slug} className="flex items-center gap-3">
                  <Checkbox
                    id={`${id}-nivel-${nivel.slug}`}
                    checked={levels.includes(nivel.slug)}
                    onCheckedChange={() => setLevels((prev) => toggle(prev, nivel.slug))}
                  />
                  <Label htmlFor={`${id}-nivel-${nivel.slug}`} className="text-base">
                    {nivel.label}
                  </Label>
                </div>
              ))}
            </fieldset>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 font-sans text-meta text-muted-foreground">Tradição</legend>
              {tradicoesDemo.map((slug) => (
                <div key={slug} className="flex items-center gap-3">
                  <Checkbox
                    id={`${id}-trad-${slug}`}
                    checked={traditions.includes(slug)}
                    onCheckedChange={() => setTraditions((prev) => toggle(prev, slug))}
                  />
                  <Label htmlFor={`${id}-trad-${slug}`} className="text-base">
                    {labelOf("tradicao", slug)}
                  </Label>
                </div>
              ))}
            </fieldset>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="link"
              onClick={() => {
                setLevels([]);
                setTraditions([]);
              }}
            >
              Limpar tudo
            </Button>
            <DrawerClose asChild>
              <Button className="flex-1">
                Ver {count} {count === 1 ? "livro" : "livros"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Button
        variant="outline"
        onClick={() =>
          toast.success("Link copiado", { description: "A seleção de filtros vai junto no link." })
        }
      >
        Mostrar toast
      </Button>
    </div>
  );
}
