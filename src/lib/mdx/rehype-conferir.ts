/**
 * Plugin rehype: troca "[CONFERIR …]" nos textos do MDX por
 * <span class="conferir-mark" title="…">… a conferir</span>.
 */
import { conferirLabel, CONFERIR_RE } from "../conferir";

type Node = {
  type: string;
  value?: string;
  tagName?: string;
  children?: Node[];
  properties?: Record<string, unknown>;
};

const titulo = "Dado em revisão editorial: será confirmado antes da versão definitiva.";

function transform(node: Node) {
  if (!node.children) return;
  const next: Node[] = [];
  for (const child of node.children) {
    if (child.type === "text" && child.value && child.value.includes("[CONFERIR")) {
      let last = 0;
      for (const match of child.value.matchAll(CONFERIR_RE)) {
        const start = match.index ?? 0;
        if (start > last) next.push({ type: "text", value: child.value.slice(last, start) });
        next.push({
          type: "element",
          tagName: "span",
          properties: { className: ["conferir-mark"], title: titulo },
          children: [{ type: "text", value: conferirLabel(match[0]) }],
        });
        last = start + match[0].length;
      }
      if (last < child.value.length) next.push({ type: "text", value: child.value.slice(last) });
    } else {
      transform(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypeConferir() {
  return (tree: Node) => transform(tree);
}
