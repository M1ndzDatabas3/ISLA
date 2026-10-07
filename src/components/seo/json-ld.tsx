import type { Graph, Thing, WithContext } from "schema-dts";

/** Dados estruturados (schema.org) para buscadores: um item ou um @graph. */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> | Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
