# Instituto Socialista Latino-Americano

Plataforma acadêmica de estudos sobre comunismo, socialismo, marxismo e pensamento crítico, com peso real para a América Latina e o Brasil. Público: estudantes, pesquisadores, professores, militantes que estudam teoria e público intelectual amplo.

Todo o conteúdo e a interface são em **português do Brasil** (datas `pt-BR`, referências em ABNT NBR 6023).

## Como trabalhamos

- **Publicação**: repositório https://github.com/M1ndzDatabas3/ISLA, deploy automático na Vercel a partir da `main`. Fluxo combinado em 07/10/2026: Claude faz a alteração, o usuário confere em `localhost:3217` e, **depois da aprovação**, Claude faz o commit (mensagem em português) e o push para a `main` sem perguntar de novo. Nada sem aprovação vai para a `main`. Na Vercel, `NEXT_PUBLIC_SITE_URL` precisa apontar para o domínio de produção.
- Entrega **por fases**. Ao fim de cada fase: rodar o projeto, verificar em 375px, 768px e 1440px (claro e escuro), listar o que foi feito e o que ficou pendente, e **esperar o ok** antes da fase seguinte.
- Decisão ambígua que muda arquitetura: perguntar. O resto: escolher o padrão sensato e registrar aqui.
- Verificação visual com a skill `/browse` (gstack). Nunca usar as ferramentas `mcp__claude-in-chrome__*`.
- Antes de criar telas, carregar a skill `frontend-design`. Para motion, seguir as skills oficiais `gsap-react`, `gsap-scrolltrigger` e `gsap-plugins`.
- Referência visual aprovada na Fase 0: https://claude.ai/artifact/8PDLbXWahK4FCPQ1BSWrKG

### Fases

0. Planejamento (aprovado)
1. Fundação (aprovada): setup, `site.config.ts`, tokens, temas, tipografia, `<Logo />` + `public/brand/`, `/styleguide`, header com mega menu, menu mobile, barra inferior, footer, GSAP + Lenis
2. Núcleo de conteúdo (entregue em 07/10/2026, aguardando ok): home completa, `/artigos` + artigo, `/biblioteca` (filtros + Flip + URL), ficha do livro, glossário, autores, busca global com `⌘K`, newsletter e "Faça parte" (Server Actions provisórias, sem provedor), banner de cookies LGPD, `/privacidade`, OG por conteúdo, sitemap
3. Estudo e exploração: trilhas, linha do tempo, mapa de pensadores, debates, acervo, podcast, agenda. A antiga "cultura" virou o **Mural Cultural** (entregue em 07/10/2026; ver seção própria)
4. Comunidade: Supabase, contas, estante pessoal, progresso, anotações, grupos de leitura, provedor de newsletter
5. Polimento: acessibilidade, Lighthouse ≥ 90, imagens e fontes, motion no mobile, deploy na Vercel

## Stack

| Camada            | Escolha                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework         | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict                                                                                                                          |
| Pacotes           | pnpm (Node 24)                                                                                                                                                                             |
| Estilo            | Tailwind CSS 4: tokens em `src/app/globals.css` (`@theme`), **sem** `tailwind.config.ts`                                                                                                   |
| Componentes       | shadcn/ui (primitivos `radix-ui`), escritos à mão em `src/components/ui` e restilizados. 21st.dev via registry (`pnpm dlx shadcn add <url>`) ou recriado; o MCP Magic não está configurado |
| Motion            | `gsap` 3.15 (todos os plugins são gratuitos) + `@gsap/react` (`useGSAP`) + `lenis`                                                                                                         |
| Conteúdo (Fase 2) | Content Collections + Zod 4 + MDX. Só `src/lib/content/` lê a fonte (troca futura por Payload/Sanity mexe só ali)                                                                          |
| Busca (Fase 2)    | Fuse.js atrás da interface `SearchProvider`; índice JSON estático carregado sob demanda                                                                                                    |
| Filtros na URL    | `nuqs`                                                                                                                                                                                     |
| OG                | `next/og` com fontes TTF em `src/assets/fonts` (Satori não lê WOFF2)                                                                                                                       |
| Apoio             | tema próprio (`ThemeProvider` + script inline no `<head>`), cmdk, vaul, sonner, lucide-react, schema-dts. Datas com `Intl` (sem lib de datas)                                              |
| Qualidade         | ESLint (flat config, CLI direto; o Next 16 não tem `next lint`), Prettier + plugin Tailwind, Vitest para funções puras                                                                     |

### Comandos

```bash
pnpm dev          # gera o manifesto da marca e sobe o servidor (nesta máquina a 3100 está ocupada: use --port 3217)
pnpm build        # manifesto + build de produção
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest
pnpm format       # Prettier
```

## Convenções de código

- Pastas, componentes, funções e tipos em **inglês**. Rotas, campos de conteúdo (`titulo`, `linhaFina`, `lerAntes`) e valores da taxonomia em **português**.
- Configuração central em `src/site.config.ts` (nome, descrição, URLs, redes). Nunca escrever o nome do instituto à mão em componentes.
- Taxonomia única em `src/lib/taxonomy.ts`; todo filtro, chip e menu deriva dela.
- Componentes de servidor por padrão; `"use client"` só onde há estado, efeito ou animação.
- Paleta duplicada em `src/lib/tokens.ts` (para OG e styleguide). Um teste do Vitest garante que bate com `globals.css`.

## Design system: "arquivo refinado"

Aprovado em 07/10/2026 (proposta: https://claude.ai/artifact/EcqE61eGz18YAgV9JyuLKe). O usuário rejeitou o estilo cartaz pesado da Fase 0 e pediu algo **limpo, minimalista, refinado e elegante**, em branco, vermelho vivo e preto. A referência construtivista fica reduzida a um gesto por tela (o quadrado vermelho, um sinal geométrico nas capas). Nada de estética SaaS: sem gradientes, glassmorphism, cantos arredondados, ilustrações 3D ou sombras decorativas.

### Cores (contraste WCAG calculado)

| Token         | Claro     | Escuro               | Uso                                                                                   |
| ------------- | --------- | -------------------- | ------------------------------------------------------------------------------------- |
| `--paper`     | `#FFFFFF` | fundo `#0A0A0A`      | fundo (branco puro)                                                                   |
| `--ink`       | `#0A0A0A` | texto `#F5F5F5`      | texto e controles (19,8:1)                                                            |
| `--ink-muted` | `#525252` | `#A3A3A3`            | metadados (7,8:1 / 7,9:1)                                                             |
| `--red`       | `#CD0000` | `#CD0000`            | acento: botão principal, símbolo, detalhes; é o vermelho da logo (5,8:1 sobre branco) |
| `--red-dark`  | `#A30000` | `#A30000`            | hover                                                                                 |
| `--red-text`  | `#CD0000` | `#FF4747`            | vermelho em texto pequeno                                                             |
| `--hair`      | `#E5E5E5` | `#262626`            | linhas finas de separação (decorativas)                                               |
|               |           | superfície `#121212` | popovers e menus no escuro                                                            |

Regras:

- O vermelho aparece no máximo duas ou três vezes por tela. Sobre vermelho, texto sempre branco (4,9:1).
- No escuro, vermelho em texto pequeno usa `#FF4747`; `#CD0000` sobre preto dá 3,4:1.
- Bordas de controles (inputs, checkboxes) usam `--input` (`#8A8A8A`, 3,4:1); `--hair` é só decorativa.
- Anel de foco: 2px, preto no claro e branco no escuro.
- **Tema padrão: claro**, mesmo com o sistema em modo escuro (pedido em 07/10/2026). O escuro só vale por escolha: botão no header ou seletor Claro/Escuro/Sistema no rodapé e no menu mobile. A escolha fica em `localStorage` (`tema`); "light" não é gravado por ser o padrão.
- Tons de seção (`tone-ink`, `tone-red`) existem, mas são de uso raro.

### Tipografia

Escolhida em 07/10/2026 entre cinco opções (https://claude.ai/artifact/Jr1grMbNpDpyzbGnhGGyFZ). A Newsreader foi descartada por ter cara de jornal tradicional.

- **Archivo** (Omnibus-Type, Buenos Aires) em tudo, carregada como fonte variável (`wdth` + `wght`) pelo `next/font`.
  - Títulos (`font-display`): semicondensada (`font-stretch: 87.5%`), peso 600, caixa normal. Itálico só em citações.
  - Leitura (`font-text`) e interface (`font-sans`): largura normal, pesos 400 e 500.
- **IBM Plex Mono** só em BibTeX.
- Escala fluida: `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-quote`, `text-lead`, `text-body`, `text-meta`. O espaçamento entre letras acompanha o tamanho (-0,028em no hero, -0,01em em títulos pequenos); não aplique `tracking-*` por cima sem motivo.
- Manifesto do hero: a linha mais longa ("Transformar a história" + quadrado) mede 8,68em. Por isso o hero usa `text-hero` (≈9,8vw, largura toda) e, no desktop, `lg:text-[clamp(3.5rem,5.6vw,5.1rem)]/[0.98]` (coluna de 7/12). Se o texto mudar, meça de novo.
- Assinatura: o quadrado vermelho (`.title-mark`) fecha títulos importantes, no lugar do ponto final. Usar com parcimônia.
- Evitar: caixa alta, rótulo antes de todo título, metadados unidos por pontos (`A · B · C`), seta `→` no fim de links.
- Com `tailwind-merge`, entrelinha junto do tamanho arbitrário: `text-[1.5rem]/[1.16]` (um `leading-*` antes de `text-[...]` é descartado).

### Forma e imagem

- Cantos retos (`--radius-*` = 0; só `rounded-full` para círculos). Linhas de 1px. Sombra (`shadow-overlay`) só em sobreposições.
- Botões: `primary` (vermelho chapado, um por tela), `outline` (1px), `link` (sublinhado que encolhe no hover), `quiet`.
- Ritmo vertical com três tokens de `@theme` (nunca valores soltos entre seções):
  - `py-section` (64 a 96px): padding de toda seção, inclusive faixas `tone-ink`/`tone-red` e o rodapé (`pt-section`).
  - `mb-section-head` (32 a 48px): título da seção até o conteúdo (já embutido em `SectionHeading`).
  - `stack` (40 a 56px): entre blocos de uma mesma seção (`mt-stack`, `mb-stack`, `gap-y-stack`). Nunca nomeie um token de espaçamento como um utilitário existente: `--spacing-block` gerava `.inline-block { inline-size }` e quebrava todo link `inline-block`.
- Entre duas seções brancas, `<Section divider>`: filete alinhado às margens do conteúdo (`section-divider`), não de ponta a ponta. Depois de faixa colorida ou do banner de citações, sem filete.
- O usuário reclamou de 256px em branco entre seções: a soma de dois `py-section` precisa parecer uma pausa, não um vazio.
- Fotos históricas em duotone (`duotone`) ou retícula. Até existirem fotos em domínio público, `HalftonePhoto` gera uma retícula ilustrativa (legenda deixa isso claro).
- Capas de livro geradas (`BookCover`): campo branco, preto ou vermelho, um sinal geométrico por tradição, título em serifada.

### Motion

- Calmo e curto. Nada atravessa a tela.
- Hero: entrada em **CSS** (`animate-rise`, `animate-reveal-up`, `animate-draw-x`…), que roda na primeira pintura sem esperar a hidratação (sem piscar, sem atrasar o LCP). O GSAP cuida do que depende de rolagem: parallax da foto (`ParallaxLayer`), entradas de seção (`Reveal`), pin, Flip.
- Tokens: 0,2s / 0,5s / 0,9s; ease `poster` (`cubic-bezier(.22,1,.36,1)`); stagger 0,06s.
- Registro: `src/lib/gsap.ts` registra `useGSAP`, ScrollTrigger e CustomEase. SplitText, Flip e DrawSVG são registrados no componente que os usa.
- Sempre `useGSAP` com `scope`, `gsap.matchMedia()` com `isDesktop`, `isMobile` e `reduceMotion`. Animar só `transform`, `opacity` e `clip-path` pontual. Pin e parallax só no desktop.
- Lenis: desligado em `prefers-reduced-motion`; `lenis.stop()` com menu, drawer ou modal abertos; `data-lenis-prevent` em áreas com scroll próprio.

### Home

- Hero "Arquivo": manifesto à esquerda ("Ler o mundo. / Organizar a luta. / Transformar a história" + quadrado vermelho) e, à direita, o vídeo da bandeira como peça de acervo: moldura 2:3 centrada verticalmente no texto, retícula muito leve por trás, marcas de corte nos cantos e legenda "Fig. 1" com botão Pausar/Reproduzir. Botão principal **Participe!** (abre o modal Participe) e link "Explore a biblioteca". Embaixo, três entradas: Trilhas de estudo, Indicação de livros e **Faça parte** (abre o mesmo modal). Arquivos: `src/components/home/hero.tsx` e `hero-media.tsx`.
- Ordem da home (pedida pelo usuário): hero, tese XI com retrato de Marx (faixa preta, "Fig. 2", palavras acendem com o scroll), destaques, banner de citações (com pausa), trilhas (trilho horizontal preso no centro da tela, só no desktop e só se couber), biblioteca comentada (contadores + estante), Mural Cultural (faixa preta: capa do mês, artistas e clássicos), linha do tempo, newsletter (faixa vermelha). **Conceito da semana e Agenda foram retirados** a pedido; a agenda volta quando houver eventos reais (`agenda-preview.tsx` está pronto).
- **Modal Participe** (`src/components/community/join-dialog.tsx`, pedido de 07/10/2026): dois caminhos escolhidos em blocos de rádio (o selecionado ganha o quadrado vermelho). **Produzir conteúdo**: nome, e-mail, WhatsApp (máscara), estado (select) e cidade (busca sem acento, lista do IBGE em `src/data/municipios.json`, servida por UF em `/municipios/[uf]`), mensagem opcional e consentimento; vai para `CONTEUDO_CONTATOS_WEBHOOK_URL`. **Mostrar minha obra no Mural**: o mesmo formulário da chamada aberta (`ChamadaFields compact`), que vai para `MURAL_INSCRICOES_WEBHOOK_URL`. Os dois formulários ficam montados (trocar de caminho não apaga o que foi digitado); os `useActionState` moram no `Participe` para o sucesso substituir o modal inteiro. `JoinDialog caminho="conteudo" | "artista"` abre com o caminho já escolhido (`/publique` e `/sobre`).
- Vídeo: `public/media/hero-bandeira.mp4` (loop de 8s com fusão na emenda, 864×1296, H.264 sem áudio, ~2,2 MB) e `hero-bandeira-poster.jpg`, gerados por `scripts/hero-video.swift` a partir de `public/herovideo.mov` (77 MB, fora do git). Toca só quando visível; parado com movimento reduzido ou economia de dados. Autoria e licença do vídeo ainda a confirmar para o crédito.

## Marca

- Logo oficial entregue em 07/10/2026 (originais em `public/logos/`, derivados em `public/brand/`; ver o README de lá). O vermelho da logo é `#CD0000` e virou o `--red` do site.
- Componente único `src/components/brand/Logo.tsx`: `variant="horizontal" | "simbolo" | "vertical"`, `tone="auto" | "color" | "light" | "dark"` (`auto` troca entre color e light conforme o tema).
- `scripts/brand-manifest.mjs` roda antes do `dev` e do `build` e grava quais arquivos existem em `public/brand/`. Se existir algum arquivo oficial da variação, o `<Logo />` passa a usá-lo; se não, desenha o placeholder (`// TODO: substituir pela logo oficial`).
- Favicon, apple-touch-icon e OG padrão usam os arquivos de `public/brand/` quando existem; senão, são gerados em `/api/brand/*`.
- Favicon (escolhido em 07/10/2026): `public/logos/favicon-white.png` (símbolo vermelho sobre branco) em peça **arredondada** (cantos de 22,5%) com filete `#E5E5E5` para não sumir em aba clara. Derivados: `public/brand/favicon.png` (128px) e `public/favicon.ico` (16 a 64px). É o **único** ícone de aba; `apple-touch-icon` e `icon-512` continuam quadrados e vermelhos (o iOS e o Android arredondam sozinhos). As URLs dos ícones levam `?v=` com o hash do arquivo (gravado pelo `brand-manifest.mjs`), então trocar o PNG já fura o cache do navegador. Se trocar o `favicon.png`, gere o `.ico` de novo.
- Logo do header trocada em 07/10/2026 por `public/logos/logo-fixed.png` (derivados `logo-horizontal*.png`: fundo branco removido; `light` com texto branco; `dark` monocromática). As linhas pequenas exigem 40px de altura no mobile e 52px no desktop (header de 80px no desktop).
- Header ao rolar: fundo preto, tudo em branco, hover em vermelho (`.site-header[data-scrolled]` em `globals.css`, fora das camadas para vencer os utilitários); a logo encolhe e troca para a versão `light`.
- Navegação: Artigos, **Leituras** (antes "Biblioteca"), Explorar (Estudar, Ideias e história, Cultura e mídia + destaque da linha do tempo), **Mural** (Artistas, Obras, Chamada aberta + capa do mês) e Instituto. "Estudar" saiu do header.
- Placeholder (só se faltar arquivo oficial): quadrado vermelho com diagonal branca fina + nome em Archivo 500.
- Especificação dos arquivos: `public/brand/README.md`.

## Páginas e estrutura (revisão de lançamento, 07/10/2026)

- **Páginas-mestre** (pedido de 07/10/2026): `/artigos`, `/leituras` e `/explorar` centralizam as categorias de cada seção do mega menu. Estrutura comum (`src/components/hub/hub.tsx`): `HubHeader` (título grande, lead e números), `HubDoors` (portas para as subseções), `CategoryDirectory` (todas as categorias com contagem) e prévias do conteúdo. `/artigos` termina na lista completa com filtros (âncora `#todos`; os links de categoria apontam para ela).
- **Mega menu montado no servidor** (`src/lib/menu.ts`, passado pelo `layout.tsx` ao `SiteHeader`): só mostra categorias com conteúdo, com a contagem (`src/lib/content/facets.ts`). Passar o mouse abre o painel; clicar no nome da seção (ou em "Ver tudo") leva à página-mestre. Rodapé e menu mobile ligam os títulos dos grupos às páginas-mestre; a barra inferior "Leituras" vai para `/leituras`.
- Breadcrumbs mostram a hierarquia: Biblioteca e Autores sob Leituras; Trilhas, Glossário e Linha do tempo sob Explorar; Artistas, Obras e Chamada aberta sob Mural.

- **Versões iniciais já no ar** (a Fase 3 aprofunda): `/trilhas` (todas as trilhas com etapas ligadas a artigo/livro/verbete e perguntas "Para pensar"; âncora por trilha, usada pela home e pelo "Próximo passo" do artigo), `/linha-do-tempo` (marcos com livros e autores do acervo) e `/sobre` (missão, linha editorial em `#linha-editorial`, princípios, como participar, contato).
- **Seções em preparação**: `soon: true` em `sections` (`src/lib/navigation.ts`) **esconde** a seção do mega menu, do menu mobile, do rodapé, do sitemap e da busca (decisão de 07/10/2026, após auditoria externa: nada de "em breve" na navegação). A URL continua existindo com `ComingSoon` + `comingSoonMetadata()` (noindex). Ao construir a seção, remova o `soon` e ela volta sozinha aos menus. Item do mega menu com um único destino vira link simples (ex.: Instituto → Sobre).
- **Listagens**: `/artigos` é um índice em linhas (`ArticleCard variant="row"`), sem a ilustração repetida; "artigos relacionados" usam `variant="compact"`. `/autores` é um diretório (`AuthorRow`: miniatura, nome, datas, tradições). A página do autor sem retrato mostra uma **ficha** na coluna esquerda em vez da moldura de iniciais.
- **[CONFERIR] na tela**: a fonte mantém o marcador; a tela mostra a etiqueta "a conferir" (`.conferir-mark`), no MDX via `src/lib/mdx/rehype-conferir.ts` e nos campos via `<WithConferir>`/`<ConferirNote>`. Referências ABNT/BibTeX usam **só dados confirmados** (`known()`, primeira edição com editora e ano conhecidos); ISBN em revisão não aparece.
- **Tipografia automática**: aspas retas viram “curvas” no MDX (`src/lib/mdx/rehype-typography.ts`). Capas geradas calculam o corpo do título pela palavra mais longa e evitam palavra curta sozinha na última linha.
- **Busca** inclui trilhas e marcos; verbetes mostram a primeira frase da definição.
- **HTML completo para buscadores**: listagens com filtros (`/biblioteca`, `/artigos`, `/autores`) usam como fallback do `<Suspense>` a versão estática da lista (`src/components/library/static-lists.tsx`); nunca um "Carregando…".
- **URL do site**: `siteConfig.url` = `NEXT_PUBLIC_SITE_URL` ou, na Vercel, `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` (automática). Links de compartilhar e a referência ABNT usam essa URL já no servidor; a data de acesso da ABNT é a do leitor (calculada no navegador e de novo ao copiar).
- **"Participe!" e "Faça parte"** são links reais (`/sobre#participar`) que o `JoinDialog` intercepta para abrir o modal. Modais e lightboxes sem `DialogTrigger` devolvem o foco ao gatilho em `onCloseAutoFocus` (guardar o elemento no clique).
- **"a conferir" na vitrine**: não usar em home, contato ou chamadas. Citação em destaque com tradução incerta: traduzir do original e creditar "tradução nossa", mostrando o original (campo `original` da citação). Contato some enquanto `contactEmail` estiver vazio.
- Prosa longa (`prose-editorial`) com `max-width: 62ch` (~72 caracteres na Archivo).
- Home sem conteúdo de exemplo: podcast só aparece com episódios `exemplo: false`; Agenda e Conceito da semana fora até haver conteúdo real.

## Mural Cultural (entregue em 07/10/2026)

Vitrine de artistas latino-americanos que fazem arte política e popular, com prioridade para o Brasil, mais a leitura crítica de obras clássicas (filmes, canções, romances).

- **Navegação** (pedido do usuário): só **Artistas** (`/mural/artistas`), **Obras** (`/mural/obras`, tudo junto: dos artistas com filtro de linguagem, para baixar, clássicos e exposições, com âncoras `#dos-artistas`, `#para-baixar`, `#classicos`, `#exposicoes`) e **Chamada aberta** (`/mural/chamada-aberta`). `/mural/classicos`, `/mural/cartazes`, `/mural/exposicoes` e `/cultura` redirecionam (308) para `/mural/obras` em `next.config.ts`. As páginas de detalhe continuam: `/mural/artistas/[slug]`, `/mural/obras/[slug]`, `/mural/exposicoes/[slug]`, `/mural/classicos/[slug]`. Mural está na barra inferior (5 itens: `grid-cols-5`).
- **Conteúdo** em `content/mural/` (schemas em `content-collections.mural.ts`; guia de cadastro em `content/mural/README.md`): `artistas/*.mdx`, `obras/*.yaml`, `exposicoes/*.mdx`, `classicos/*.mdx`, `capas/AAAA-MM.yaml` (capa do mês) e `textos/` (manifesto, compromisso, chamada aberta). Imagens em `public/mural/<artista>/<obra>/principal.jpg` (e `alta.jpg` para zoom e download).
- **Regras que quebram o build**: artista `publicado` sem `autorizacao`; `alt` com menos de 15 caracteres; `permiteDownload` sem licença Creative Commons ou sem `arquivoParaDownload`; arquivo de imagem inexistente. Largura, altura e `blurDataURL` saem do `sharp` na transformação. Referências quebradas entre coleções (`findBrokenMuralReferences`) param o build e os testes.
- **Content Collections**: a saída do `transform` precisa ser serializável. Use `null`, nunca `undefined`, e `type` em vez de `interface` nos tipos devolvidos. Para enums derivados de listas, use o `slugsOf` genérico, que preserva os literais.
- **Demonstração**: os 5 artistas e 13 obras atuais são fictícios (`demo: true`, selo "Exemplo"). `MURAL_DEMO=1` mostra em qualquer ambiente, `MURAL_DEMO=0` esconde sempre e, sem a variável, aparecem só fora de produção. Em produção, sem artistas reais, o Mural mostra os clássicos e estados vazios que levam à chamada aberta; o destaque do mega menu cai no convite da chamada.
- **Obra**: nada de duotone, sobreposição de cor ou corte. A imagem fica em passe-partout (`object-contain`) e o crédito do artista aparece sempre (card, página, lightbox, OG). Download só com licença CC. Lightbox (`src/components/mural/lightbox.tsx`): Flip da miniatura, setas, Esc, deslize e zoom em tamanho real.
- **Exposição**: parede horizontal presa (pin) no desktop com legendas por `containerAnimation`; no mobile, rolagem vertical com snap `proximity`.
- **Compartilhar**: cards em `/og/mural/[tipo]/[slug]?formato=horizontal|quadrado|story` (artista, obra, exposição). O `ShareImageButton` recebe `imageBase` (string), porque funções não passam de Server para Client Components.
- **Inscrições**: Server Action `inscreverNoMural` → webhook `MURAL_INSCRICOES_WEBHOOK_URL` (POST JSON; Apps Script, Formspree, Make, n8n…). Sem a variável, desenvolvimento aceita sem gravar e produção responde "abre em breve". Sem upload de arquivos: só links.
- **JSON-LD**: `Person`, `VisualArtwork`, `ExhibitionEvent` e `CreativeWork` (clássicos).

## Citação compartilhável (entregue em 07/10/2026)

- **Rota** `src/app/og/citacao/route.tsx` (imagem em `src/lib/og/quote-card.tsx`):
  - `?id=<slug>`: citação de `content/citacoes`;
  - `?artigo=<slug>&texto=<seleção>`: trecho de artigo;
  - `&formato=quadrado|stories|link` (1080², 1080×1920, 1200×630);
  - `&tema=papel|tinta|vermelho`.
    Resposta com `s-maxage` de um ano (a CDN guarda até o próximo deploy); erros em texto, `no-store`.
- **Regras de segurança** (`src/lib/share/excerpt.ts`, com testes):
  - O texto do card nunca vem do parâmetro. A seleção só localiza o trecho no corpo do artigo (comparando só letras e números, sem aspas, hífens, pontuação nem marcação) e o card mostra o texto do próprio artigo, com palavras inteiras nas pontas.
  - A atribuição sai dos dados: assinatura do artigo ("Trecho de: título") ou, dentro de `<Citacao>`, o autor citado ("Citado em: título").
  - A rota recusa (400): trecho inexistente, mais de 400 caracteres, menos de 12 letras e frase com `[CONFERIR]` (a marca vale até o ponto final). Notas de rodapé não entram.
- **Card** no espírito dos lambes, a pedido do usuário: Lora itálica, Oswald em caixa alta na atribuição, aspas grandes e régua vermelhas.
  - Cores: papel `#F3EEE4` com grão, tinta `#111` e vermelho `#C8102E`. É exceção consciente à Archivo e ao `#CD0000` do site, só nos cards.
  - Stories reserva 250px no topo e 300px na base.
  - Corpo por extensão: até 120, 240 e 400 caracteres.
  - Logo: color no papel, light na tinta e toda branca no vermelho (`src/assets/og/logo-horizontal-branca.png`, derivada da monocromática).
  - Grão e logo branca vêm de `scripts/og-assets.mjs`.
  - No Satori, `inset` não funciona (use `top/left/width/height`) e `radial-gradient` escurece o card inteiro.
- **Interface** (`src/components/share/`):
  - `QuoteShareDialog`: modal no desktop e drawer no celular, com prévia, formato, tema, Compartilhar (arquivo pela Web Share API, senão o link), Baixar imagem e Copiar link. O link leva `#:~:text=` (`fragmentoDeTexto`) e o navegador destaca o trecho (`::target-text` em vermelho claro).
  - `ShareQuoteButton`: botão "Compartilhar citação" (ou só ícone, na faixa da home). É usado na citação em destaque da home, na faixa de citações, nas páginas de autor e nos `<Citacao>` dos artigos, onde aparece no hover com mouse e sempre no toque.
  - `SelectionShare`: só na página de artigo. Selecionar um trecho do corpo abre "Compartilhar citação" e "Copiar". No desktop o menu flutua acima da seleção; no celular é uma barra na base. Some ao rolar.
  - Partes que não são texto ficam fora da seleção copiada: `sup`, `.conferir-mark`, âncora de título e `[data-share-ignore]`. O termo do glossário é um `<button>` com o texto e fica.
- **Pendente**: "Hoje na história" (etapa opcional) não foi feito. Os marcos da linha do tempo só têm mês e ano, e o dia exigiria dados que o acervo não tem.

## Conteúdo

- Autores e obras reais. **Nunca inventar citações nem dados bibliográficos.** Dado incerto (ano, editora, ISBN, tradução) leva `[CONFERIR]`.
- Livros fora do domínio público: só ficha, sinopse original e links externos. Texto integral só em `/acervo`, e só obras em domínio público.
- Imagens só em domínio público ou CC, com crédito, licença e fonte obrigatórios.
- Artigos de exemplo são assinados por "Redação do Instituto", nunca atribuídos a pessoas reais.

## Acessibilidade, SEO e privacidade

- Contraste AA, foco visível (anel de 2px preto/branco), navegação por teclado, `aria` correto em menus, drawers e modais, alvos de toque ≥ 44×44px.
- Mobile first. Breakpoints 360, 768, 1024, 1280, 1536. Nenhum scroll horizontal acidental.
- Metadados por página, sitemap, robots, JSON-LD (`Article`, `Book`, `Person`, `DefinedTerm`, `Event`). `/styleguide` publicado com `noindex` e fora do menu.
- LGPD: banner de cookies com recusa tão fácil quanto aceitar e opção mais privada por padrão; consentimento explícito na newsletter; analytics sem cookies (Plausible ou Umami) só como opção configurável.
  - Implementação: `src/lib/consent.ts` (localStorage `isla-consentimento`) e `src/components/privacy/cookie-consent.tsx`. Plausible só carrega com consentimento **e** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. "Preferências de cookies" no rodapé reabre o painel.
  - Formulários (newsletter e Faça parte) guardam o texto e a versão do consentimento. Os provedores provisórios aceitam só em desenvolvimento, dizem que é teste e não gravam nada; em produção respondem "abre em breve". O destino real entra na Fase 4 (Supabase + provedor de e-mail).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Padrões aprendidos na implementação

- **Radix + GSAP em sobreposições**: o Portal do Radix monta o conteúdo depois do primeiro commit. A animação de entrada fica num componente renderizado _dentro_ do `Content` (ver `MenuPanel` em `mobile-menu.tsx`); fechar só inverte a timeline e depois desmonta. Overlays simples (modal, popover, mega menu) usam as animações CSS do `tw-animate-css`, que o Radix espera terminar.
- **Escopo do `useGSAP`**: seletores procuram só dentro do `scope`, nunca no próprio elemento do ref. Envolva o alvo num wrapper.
- **Composições gráficas não cruzam títulos**: formas do hero ficam numa área própria do grid, não em camada absoluta por cima do texto (vermelho sobre vermelho some).
- **Capas geradas**: nada da cor do texto na faixa do autor (topo ~20%) nem do título (base ~30%), nas duas orientações (a capa pode ser espelhada).
- **Grids com régua**: use bordas nos itens (`border-r-2 border-b-2` + `border-t-2 border-l-2` no contêiner), não `gap-px` com fundo tinta: itens escondidos pelo reveal deixariam um bloco preto.
- **Tons de seção**: dentro de `.tone-red`, `--brand` vira tinta (botão primário fica tinta sobre vermelho). Demonstrações de cor absoluta (logo sobre papel/tinta/vermelho) usam `bg-paper`/`bg-ink`/`bg-red`, que não mudam com o tema.
- **Constantes usadas no servidor** não podem vir de arquivos `"use client"` (viram referência de cliente). Ex.: `themeInitScript` mora em `src/lib/theme.ts`.
- `NEXT_PUBLIC_SITE_URL` precisa estar definido em produção; sem ele, `og:image` e o sitemap apontam para `http://localhost:3000` (na Vercel, o fallback é o domínio de produção do projeto).
- **Cards nas redes exigem site público**: com a Deployment Protection (Vercel Authentication) ligada para produção, WhatsApp, X e afins recebem a tela de login e o link sai sem imagem.
- **Formulários com Server Action**: o `<form action>` do React 19 reinicia o formulário depois de cada envio, e um `<select>` controlado volta para a primeira opção na tela (o estado continua outro). Use `onSubmit` com `preventDefault` + `startTransition(() => action(formData))` e mantenha `action={action}` para funcionar sem JavaScript.
- **Pin com Lenis**: o trilho horizontal prende com `start: "center center"` e só se o conteúdo couber na tela (`innerHeight - 2 × header`); senão vira faixa com scroll-snap.
- **Duotone + parallax**: `ParallaxLayer` (com `will-change`) cria contexto de empilhamento e anula o `mix-blend-mode` do `duotone`. Foto com parallax fica em preto e branco (`grayscale`).
- **Links em colunas estreitas**: `inline-block` em lista flex dentro de grid encolhia para a largura mínima (quebra palavra por palavra no Chrome). Use `block`.
- **`sed -i` do macOS não entende `\b`**: a substituição falha em silêncio. Para renomear classes, use um script Python (ou `perl -pi`) e confira com `grep` depois.
