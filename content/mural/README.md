# Mural Cultural: como cadastrar conteúdo

Enquanto não existe um backoffice, o Mural é alimentado por arquivos nesta pasta e imagens em `public/mural/`. Ao salvar, o servidor de desenvolvimento (`pnpm dev`) recarrega sozinho. O comando `node scripts/content-check.mjs` (que roda antes do `dev` e do `build`) aponta qualquer erro com o nome do arquivo e o campo.

## Regras que travam a publicação

O build falha, com mensagem clara, se:

- um artista estiver com `status: publicado` sem `autorizacao` (data e escopo);
- uma imagem não tiver `alt` descritivo (mínimo de 15 caracteres);
- uma obra tiver `permiteDownload: true` sem licença Creative Commons ou sem `arquivoParaDownload`;
- um caminho de imagem ou de arquivo não existir em `public/`;
- uma obra apontar para um artista que não existe, ou uma exposição para uma obra que não existe.

## Pastas de imagens

```
public/mural/<artista>/retrato.jpg                 retrato (opcional)
public/mural/<artista>/<obra>/principal.jpg        imagem exibida no site
public/mural/<artista>/<obra>/detalhe-1.jpg        imagens extras (opcional)
public/mural/<artista>/<obra>/alta.jpg             arquivo para download (só com licença CC)
public/mural/classicos/<classico>/imagem.jpg       só domínio público ou licenciada
```

Use os mesmos slugs dos arquivos de conteúdo (minúsculas, sem acento, com hífen).

**Tamanhos recomendados**

| Uso | Formato | Tamanho |
|---|---|---|
| `principal.jpg` | JPG (qualidade 80 a 85) ou PNG para arte com áreas chapadas | lado maior entre 1600 e 2400 px, até 1 MB |
| `alta.jpg` (download) | JPG qualidade 90 ou PDF | lado maior de 3000 px ou mais (300 dpi no tamanho de impressão) |
| `retrato.jpg` | JPG | 1200 × 1500 px |

Não recorte nem aplique filtro: a obra é exibida inteira, na proporção original. Largura, altura e o desfoque de carregamento são lidos do próprio arquivo, não é preciso informar.

## Artista: `content/mural/artistas/<slug>.mdx`

```yaml
---
nome: "Nome artístico"
nomeCivil: "Nome civil"            # opcional
cidade: "Recife"
estado: PE                         # sigla da UF; omita para quem é de outro país
pais: "Brasil"                     # padrão "Brasil"
linguagens: [artes-visuais, cartaz-e-design]
bioCurta: "Uma ou duas frases (até 280 caracteres)."
bio: "Bio longa. Parágrafos separados por linha em branco."
retrato:                           # opcional
  src: "/mural/<slug>/retrato.jpg"
  alt: "Descrição do retrato"
links:                             # todos opcionais
  instagram: "https://instagram.com/…"
  site: "https://…"
  loja: "https://…"
  encomendas: "mailto:contato@…"
temas: [trabalho, cidade]
autorizacao:
  data: "2026-10-01"
  escopo: "Publicação do perfil e das obras X, Y e Z no site e nas redes do Instituto."
status: publicado                  # rascunho não aparece
destaque: true
publicadoEm: "2026-10-01"
---

### Primeira pergunta da entrevista?

Resposta em parágrafos.
```

Linguagens: `artes-visuais`, `ilustracao-e-quadrinhos`, `fotografia`, `cartaz-e-design`, `cordel-e-literatura`, `musica`, `cinema-e-audiovisual`, `teatro-e-performance`.
Temas: `trabalho`, `terra`, `memoria`, `raca`, `genero`, `cidade`, `imperialismo`.

## Obra: `content/mural/obras/<slug>.yaml`

```yaml
titulo: "Título"
artista: <slug-do-artista>
ano: 2026
linguagem: cartaz-e-design
tecnica: "Xilogravura sobre papel"
dimensoes: "50 × 40 cm"            # opcional
imagens:
  - src: "/mural/<artista>/<obra>/principal.jpg"
    alt: "Descrição do que a imagem mostra, para quem não vê."
    credito: "Foto: Fulana"        # opcional, quando a foto não é do artista
descricao: "O que a obra é e mostra."
comentarioCuratorial: "Opcional."
temas: [trabalho]
licenca: cc-by-nc-sa               # todos-os-direitos-reservados | cc-by | cc-by-sa | cc-by-nc | cc-by-nc-sa
permiteDownload: true              # só com licença cc-*
arquivoParaDownload: "/mural/<artista>/<obra>/alta.jpg"
impressao:                         # opcional, para cartazes
  formato: "A3, papel 90 g"
  observacao: "Imprima sem margem."
textosRelacionados:                # opcional
  - tipo: artigo                   # artigo | trilha | verbete | livro
    slug: o-que-e-mais-valia
disponivelParaVenda: false
linkDeVenda: "https://…"           # opcional
publicadoEm: "2026-10-01"
```

Obras com `permiteDownload: true` aparecem automaticamente em **Cartazes**.

## Exposição: `content/mural/exposicoes/<slug>.mdx`

```yaml
---
titulo: "Título da mostra"
subtitulo: "Opcional"
curadoria: ["Nome da curadora"]
obras: [slug-1, slug-2, slug-3]    # na ordem da visita
trilha: primeiros-passos           # opcional
inicio: "2026-11-01"
fim: "2027-01-31"                  # opcional
---

Texto curatorial de abertura.
```

## Clássico: `content/mural/classicos/<slug>.mdx`

```yaml
---
titulo: "Vidas secas"
autoria: "Graciliano Ramos"
ano: 1938
pais: "Brasil"
linguagem: romance                 # filme | cancao | romance | poesia | gravura | pintura | cartaz | teatro
sinopse: "Resumo curto."
ondeEncontrar:
  - rotulo: "Assistir no …"
    url: "https://…"
conceitos: [alienacao]             # slugs do glossário
autores: [paulo-freire]            # slugs de content/autores
---

Leitura crítica.
```

## Capa do mês: `content/mural/capas/AAAA-MM.yaml`

```yaml
mes: "2026-11"
obra: <slug-da-obra>
ilustra:                           # opcional
  tipo: artigo                     # artigo | trilha
  slug: superexploracao-marini
texto: "Texto curto do artista sobre a obra (até 400 caracteres)."
```

Vale a capa do mês corrente ou, se não houver, a mais recente.

## Textos editáveis

`content/mural/textos/manifesto.mdx`, `compromisso.mdx` e `chamada-aberta.mdx`: edite o texto à vontade, mantendo o `titulo` no topo.

## Demonstração

Arquivos com `demo: true` (os artistas fictícios) só aparecem em desenvolvimento, ou com `MURAL_DEMO=1`. Em produção ficam ocultos. Quando cadastrar os artistas reais, apague os arquivos de demonstração e as pastas correspondentes em `public/mural/` (as imagens de exemplo são geradas por `node scripts/mural-placeholders.mjs`).
