/**
 * Aspas tipográficas para texto em português: "texto" → “texto”.
 * Abre quando vem depois de espaço/início (ou de parêntese) e antes de algo
 * que não é espaço; fecha nos demais casos.
 */
export function curlyQuotes(text: string, prevChar = "", nextChar = ""): string {
  if (!text.includes('"')) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (ch !== '"') {
      out += ch;
      continue;
    }
    const prev = i > 0 ? text[i - 1]! : prevChar;
    const next = i < text.length - 1 ? text[i + 1]! : nextChar;
    const afterBoundary = prev === "" || /[\s([{—–/]/.test(prev);
    const opens = afterBoundary && (next === "" ? prev !== "" : !/\s/.test(next));
    out += opens ? "“" : "”";
  }
  return out;
}
