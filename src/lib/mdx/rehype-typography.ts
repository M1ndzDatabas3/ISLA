/** Plugin rehype: aspas tipográficas nos textos do MDX (fora de código). */
import { curlyQuotes } from "../typography";

type Node = { type: string; value?: string; tagName?: string; children?: Node[] };

function walk(node: Node) {
  if (!node.children || node.tagName === "code" || node.tagName === "pre") return;
  node.children.forEach((child, i) => {
    if (child.type === "text" && child.value) {
      const prev = node.children![i - 1];
      const next = node.children![i + 1];
      // Vizinhos não textuais (ex.: <em>) contam como "algo colado" à aspa.
      const prevChar = prev ? "x" : "";
      const nextChar = next ? "x" : "";
      child.value = curlyQuotes(child.value, prevChar, nextChar);
    } else {
      walk(child);
    }
  });
}

export default function rehypeTypography() {
  return (tree: Node) => walk(tree);
}
