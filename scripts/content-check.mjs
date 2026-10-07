/**
 * Valida /content contra os schemas de content-collections.ts e FALHA alto.
 * O Content Collections, sozinho, descarta em silêncio documentos inválidos
 * (inclusive YAML mal formado, sem emitir evento). Por isso, além dos eventos
 * de erro, este script compara os arquivos em disco com os documentos gerados.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { createBuilder } from "@content-collections/core";

/** Espelha os `directory`/`include` de content-collections.ts. */
const collections = {
  allAutores: ["content/autores", ".mdx"],
  allLivros: ["content/livros", ".mdx"],
  allConceitos: ["content/glossario", ".mdx"],
  allArtigos: ["content/artigos", ".mdx"],
  allTrilhas: ["content/trilhas", ".yaml"],
  allMarcos: ["content/marcos", ".yaml"],
  allCitacoes: ["content/citacoes", ".yaml"],
  allEventos: ["content/eventos", ".yaml"],
  allEpisodios: ["content/episodios", ".yaml"],
  allArtistas: ["content/mural/artistas", ".mdx"],
  allObras: ["content/mural/obras", ".yaml"],
  allExposicoes: ["content/mural/exposicoes", ".mdx"],
  allClassicos: ["content/mural/classicos", ".mdx"],
  allCapas: ["content/mural/capas", ".yaml"],
  allMuralTextos: ["content/mural/textos", ".mdx"],
};

const builder = await createBuilder(join(process.cwd(), "content-collections.ts"));
const problems = [];

const describe = (event) => {
  const file = event.document?._meta?.filePath ?? event.filePath ?? "";
  const issues = event.error?.issues ?? event.issues;
  const detail = Array.isArray(issues)
    ? issues.map((i) => `${(i.path ?? []).join(".") || "(raiz)"}: ${i.message}`).join("; ")
    : (event.error?.message ?? String(event.error ?? ""));
  return `${event.collection?.name ?? ""} ${file} ${detail}`.trim();
};

for (const key of [
  "collector:read-error",
  "collector:parse-error",
  "transformer:validation-error",
  "transformer:result-error",
  "transformer:error",
]) {
  builder.on(key, (event) => problems.push(`[${key}] ${describe(event)}`));
}

await builder.build();

let total = 0;
for (const [name, [dir, ext]] of Object.entries(collections)) {
  const onDisk = readdirSync(dir).filter((f) => f.endsWith(ext) && !f.startsWith("_"));
  const url = pathToFileURL(
    join(process.cwd(), ".content-collections/generated", `${name}.js`),
  ).href;
  const { default: docs } = await import(`${url}?t=${Date.now()}`);
  const generated = new Set(docs.map((d) => d._meta.fileName));
  total += docs.length;
  for (const file of onDisk) {
    if (!generated.has(file)) {
      problems.push(
        `${dir}/${file} foi descartado (YAML/frontmatter inválido ou fora do schema; strings com ":" precisam de aspas).`,
      );
    }
  }
}

if (problems.length) {
  console.error(
    `[conteúdo] ${problems.length} problema(s) em /content:\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`[conteúdo] ${total} documentos válidos.`);
