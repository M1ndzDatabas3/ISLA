# Arquivos da marca

Guia da marca do Instituto Socialista Latino-Americano. Coloque os arquivos nesta pasta **com exatamente estes nomes** (SVG ou PNG) e rode `pnpm dev` ou `pnpm build`. O script `scripts/brand-manifest.mjs` detecta o que existe e o site passa a usar os arquivos oficiais no lugar da logo provisória, sem mexer em nenhuma página.

## Logo (SVG ou PNG)

Três variações, cada uma em três tons. Total: 9 arquivos.

| Arquivo                     | Variação   | Tom   | Onde aparece                                  |
| --------------------------- | ---------- | ----- | --------------------------------------------- |
| `logo-horizontal.svg`       | horizontal | color | header (tema claro), cards OG, e-mails        |
| `logo-horizontal-light.svg` | horizontal | light | header (tema escuro), fundos tinta e vermelho |
| `logo-horizontal-dark.svg`  | horizontal | dark  | impressão em uma cor                          |
| `logo-simbolo.svg`          | símbolo    | color | header encolhido, avatar das redes            |
| `logo-simbolo-light.svg`    | símbolo    | light | header encolhido no tema escuro               |
| `logo-simbolo-dark.svg`     | símbolo    | dark  | uso monocromático                             |
| `logo-vertical.svg`         | vertical   | color | página Sobre, materiais impressos             |
| `logo-vertical-light.svg`   | vertical   | light | footer (fundo tinta)                          |
| `logo-vertical-dark.svg`    | vertical   | dark  | uso monocromático                             |

### O que cada tom significa

- **color**: versão principal, para fundos claros (branco `#FFFFFF`).
- **light**: para fundos escuros e vermelhos (preto `#0A0A0A`, vermelho `#CD0000`). Elementos que seriam tinta viram papel. Se o símbolo tiver vermelho, ele precisa de contorno ou separação para não sumir sobre o fundo vermelho.
- **dark**: monocromática em preto, para impressão em uma cor.

### Proporções e tamanhos

- **Horizontal**: proporção livre, recomendada entre 4:1 e 6:1. No header ela é exibida com **altura máxima de 40px no desktop e 32px no mobile**. Precisa continuar legível a 32px de altura.
- **Símbolo**: **quadrado (1:1)**. Usado a partir de 16px (favicon), então evite detalhes finos.
- **Vertical**: proporção livre, recomendada entre 1:1 e 1:1,6.
- **Área de proteção**: reserve em volta da logo um espaço livre igual a 1/4 da altura do símbolo.
- Use `viewBox` sem `width`/`height` fixos, texto convertido em curvas e nenhuma fonte externa.

## Ícones e compartilhamento

| Arquivo                | Formato      | Tamanho                          | Uso                              |
| ---------------------- | ------------ | -------------------------------- | -------------------------------- |
| `favicon.svg`          | SVG quadrado | qualquer (testar em 16px e 32px) | aba do navegador                 |
| `apple-touch-icon.png` | PNG          | **180×180**                      | atalho na tela inicial do iPhone |
| `icon-512.png`         | PNG          | **512×512**                      | PWA e manifest                   |
| `og-default.png`       | PNG ou JPG   | **1200×630**                     | card padrão de compartilhamento  |

No `apple-touch-icon.png` e no `icon-512.png`, use fundo chapado (sem transparência) e deixe cerca de 10% de margem em volta do símbolo, porque alguns sistemas cortam os cantos.

## Paleta de referência

| Nome            | Hex       |
| --------------- | --------- |
| Vermelho        | `#CD0000` |
| Vermelho escuro | `#A30000` |
| Preto           | `#0A0A0A` |
| Branco          | `#FFFFFF` |

## Comportamento enquanto faltam arquivos

- Se uma variação tem algum arquivo oficial, o site usa esse arquivo. Se faltar só um tom, usa a versão `color` daquela variação.
- Se a variação não tem nenhum arquivo, aparece a logo provisória (quadrado vermelho com diagonal).
- Sem `favicon.svg`, `apple-touch-icon.png`, `icon-512.png` ou `og-default.png`, o site gera versões provisórias em `/api/brand/*`.

## Estado atual (07/10/2026)

Os originais enviados estão em `public/logos/`. A partir deles foram gerados os arquivos desta pasta:

| Arquivo                                | Origem                                                         |
| -------------------------------------- | -------------------------------------------------------------- |
| `logo-horizontal.png`                  | `ISLA-logo.png`, recortado nas margens                         |
| `logo-horizontal-light.png`            | derivado: o preto do texto virou branco (para o tema escuro)   |
| `logo-horizontal-dark.png`             | `ISLA-logo-black.png`, fundo branco removido                   |
| `logo-vertical.png`                    | `ISLA-logo-empe.png`, fundo branco removido                    |
| `logo-vertical-light.png`              | derivado: o preto do texto virou branco                        |
| `logo-simbolo.png`                     | derivado: foice e martelo recortados da logo horizontal        |
| `favicon.png`                          | `favicon.png` (64×64), sem alteração                           |
| `apple-touch-icon.png`, `icon-512.png` | derivados no padrão do favicon: símbolo branco sobre `#CD0000` |

Os derivados são provisórios: se a versão oficial de algum deles existir, basta substituir o arquivo. Um SVG da logo e do favicon deixaria tudo mais nítido em qualquer tamanho.
