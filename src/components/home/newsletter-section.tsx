import { NewsletterForm } from "@/components/newsletter/newsletter-form";

/** Chamada da newsletter em faixa vermelha, texto em branco. */
export function NewsletterSection() {
  return (
    <section id="newsletter" aria-labelledby="newsletter-titulo" className="tone-red py-section">
      <div className="container-page grid-page items-end gap-y-12">
        <div className="col-span-12 lg:col-span-6">
          <h2 id="newsletter-titulo" className="font-display text-h1">
            Um e-mail com o que publicamos de novo
          </h2>
          <p className="mt-6 max-w-[44ch] text-lead">
            Novos textos, trilhas de estudo e seções do site. Sem propaganda, e seu e-mail não é
            repassado a ninguém.
          </p>
        </div>
        <NewsletterForm origem="home" className="col-span-12 lg:col-span-5 lg:col-start-8" />
      </div>
    </section>
  );
}
