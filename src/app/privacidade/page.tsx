import type { Metadata } from "next";
import Link from "next/link";

import { ConferirMark } from "@/components/editorial/conferir";
import { Section } from "@/components/layout/section";
import { CookiePreferencesButton } from "@/components/privacy/cookie-consent";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { sections } from "@/lib/navigation";
import { consentimentoInteresse } from "@/lib/interesse-consent";
import { consentimentoNewsletter } from "@/lib/newsletter-consent";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: sections.privacidade.description,
  alternates: { canonical: sections.privacidade.href },
};

const atualizadaEm = "7 de outubro de 2026";
const contato = siteConfig.contactEmail ? (
  <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
) : (
  <ConferirMark label="e-mail do encarregado de dados a conferir" />
);

export default function PrivacidadePage() {
  return (
    <Section tone="paper" className="pt-[clamp(32px,5vw,64px)]">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Privacidade" }]}
        className="mb-12"
      />
      <div className="grid-page gap-y-10">
        <header className="col-span-12 lg:col-span-8">
          <h1 className="font-display text-h1">Política de privacidade</h1>
          <p className="mt-6 max-w-[56ch] text-lead text-muted-foreground">
            O que o site guarda, para quê, por quanto tempo e como você exerce seus direitos pela
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
          <p className="mt-4 text-meta text-muted-foreground">Atualizada em {atualizadaEm}.</p>
        </header>

        <div className="prose-editorial col-span-12 lg:col-span-8">
          <h2 id="resumo">Em resumo</h2>
          <ul>
            <li>Não usamos cookies de publicidade nem de rastreamento entre sites.</li>
            <li>Sem a sua escolha, vale a opção mais privada: nada opcional é carregado.</li>
            <li>A medição de audiência só funciona se você permitir, e não usa cookies.</li>
            <li>
              Seu e-mail só entra na newsletter ou no Faça parte com autorização expressa, e sai
              quando você pedir.
            </li>
          </ul>

          <h2 id="controlador">Quem trata os dados</h2>
          <p>
            {siteConfig.name}, inscrito no CNPJ <ConferirMark label="a conferir" />, com sede em{" "}
            <ConferirMark label="endereço a conferir" />. Para qualquer assunto sobre dados
            pessoais, escreva para {contato}.
          </p>

          <h2 id="navegacao">Navegação e armazenamento no navegador</h2>
          <p>
            Para o site funcionar, guardamos no seu próprio navegador (armazenamento local, não
            cookies) duas informações: o tema escolhido, claro ou escuro (chave{" "}
            <code>{THEME_STORAGE_KEY}</code>), e a sua decisão sobre cookies (chave{" "}
            <code>isla-consentimento</code>). Esses dados não são enviados a nós nem a terceiros e
            podem ser apagados limpando os dados do site no navegador.
          </p>

          <h2 id="medicao">Medição de audiência (opcional)</h2>
          <p>
            Se você permitir, contamos visitas com o Plausible Analytics, que não usa cookies e não
            cria perfis. São registrados dados agregados: página visitada, site de origem, país e
            tipo de aparelho. O endereço IP não é guardado. A base legal é o seu consentimento (art.
            7º, I), que pode ser retirado a qualquer momento.
          </p>
          <p>
            <CookiePreferencesButton className="cursor-pointer font-medium text-brand-text underline underline-offset-4" />
          </p>

          <h2 id="newsletter">Newsletter</h2>
          <p>
            Quando você assina a newsletter, tratamos o seu e-mail e o registro do consentimento: a
            data e a versão do texto que você autorizou. O texto atual (versão{" "}
            {consentimentoNewsletter.versao}) é: “{consentimentoNewsletter.texto}”
          </p>
          <p>
            O e-mail é usado só para enviar a newsletter. Todo envio traz um link para cancelar.
            Depois do cancelamento, o endereço é apagado em até 30 dias; guardamos apenas o registro
            de que houve consentimento e revogação, pelo tempo necessário para comprovar que a lei
            foi cumprida (art. 16). O serviço de envio de e-mails será indicado aqui quando for
            contratado <ConferirMark />.
          </p>

          <h2 id="faca-parte">Faça parte</h2>
          <p>
            O formulário Faça parte é para quem quer criar e desenvolver conteúdo com o Instituto.
            Nele tratamos nome, e-mail, WhatsApp, estado e cidade, a mensagem (opcional) e o
            registro do consentimento. O texto atual (versão {consentimentoInteresse.versao}) é: “
            {consentimentoInteresse.texto}”
          </p>
          <p>
            Esses dados servem só para a equipe editorial falar com você sobre produção de conteúdo.
            Não são publicados nem repassados. Ficam guardados por até dois anos sem novo contato,
            ou até você pedir a exclusão, o que vier primeiro.
          </p>

          <h2 id="direitos">Seus direitos</h2>
          <p>Pelo art. 18 da LGPD, você pode pedir a qualquer momento:</p>
          <ul>
            <li>confirmação de que tratamos dados seus e acesso a eles;</li>
            <li>correção de dados incompletos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>portabilidade dos dados;</li>
            <li>informação sobre com quem compartilhamos dados;</li>
            <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
          </ul>
          <p>
            Os pedidos são respondidos em até 15 dias pelo e-mail {contato}. Se não ficar
            satisfeito, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>

          <h2 id="seguranca">Segurança</h2>
          <p>
            O site é servido apenas por conexão criptografada (HTTPS). Coletamos o mínimo necessário
            e não vendemos nem cedemos dados pessoais.
          </p>

          <h2 id="mudancas">Mudanças nesta política</h2>
          <p>
            Quando novas funções passarem a tratar dados (contas de usuário, comentários, envio de
            textos em <Link href={sections.publique.href}>Publique</Link>), esta página será
            atualizada antes de elas entrarem no ar, com nova data no topo.
          </p>
        </div>
      </div>
    </Section>
  );
}
