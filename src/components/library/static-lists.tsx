/**
 * Versões estáticas (renderizadas no servidor) das listagens com filtros.
 * Entram como fallback do <Suspense>: buscadores e quem está sem JavaScript
 * veem o conteúdo completo; os filtros assumem quando a página carrega.
 */
import { ArticleCard, type ArticleCardData } from "@/components/editorial/article-card";
import { AuthorRow, type AuthorCardData } from "@/components/editorial/author-card";
import { BookCard } from "@/components/editorial/book-card";
import { toBookCard, type BookSummary } from "@/lib/content/summaries";

function Toolbar({ count, noun }: { count: number; noun: [string, string] }) {
  return (
    <div className="flex min-h-[3.25rem] items-end justify-end border-b border-hair pb-5">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground tabular-nums">{count}</span>{" "}
        {count === 1 ? noun[0] : noun[1]}
      </p>
    </div>
  );
}

export function StaticLibrary({ books }: { books: BookSummary[] }) {
  return (
    <div className="grid-page items-start gap-y-8">
      <div aria-hidden className="hidden lg:col-span-3 lg:block" />
      <div className="col-span-12 min-w-0 lg:col-span-9">
        <Toolbar count={books.length} noun={["livro", "livros"]} />
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 pt-8 sm:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.slug} book={toBookCard(book)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StaticArticles({ articles }: { articles: (ArticleCardData & { slug: string })[] }) {
  return (
    <div>
      <Toolbar count={articles.length} noun={["artigo", "artigos"]} />
      {articles.map((article) => (
        <ArticleCard
          key={article.slug}
          article={article}
          variant="row"
          headingLevel="h2"
          className="first:border-t-0"
        />
      ))}
    </div>
  );
}

export function StaticAuthors({ authors }: { authors: (AuthorCardData & { slug: string })[] }) {
  return (
    <div>
      <Toolbar count={authors.length} noun={["autor", "autores"]} />
      <div className="grid gap-x-[clamp(16px,2vw,32px)] pt-stack md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <AuthorRow key={author.slug} author={author} />
        ))}
      </div>
    </div>
  );
}
