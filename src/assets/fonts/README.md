# Fontes para imagens OG

Instâncias estáticas da Archivo usadas só pelo `next/og` (o Satori não lê WOFF2 nem fontes variáveis). O site carrega a Archivo variável pelo `next/font/google`.

| Arquivo                                  | Instância                       | Uso no OG      |
| ---------------------------------------- | ------------------------------- | -------------- |
| `Archivo-SemiCondensed-SemiBold.ttf`     | largura 87,5, peso 600          | títulos        |
| `Archivo-SemiCondensed-Medium.ttf`       | largura 87,5, peso 500          | títulos médios |
| `Archivo-SemiCondensed-MediumItalic.ttf` | largura 87,5, peso 500, itálico | citações       |
| `Archivo-Regular.ttf`                    | largura 100, peso 400           | texto          |
| `Archivo-Medium.ttf`                     | largura 100, peso 500           | interface      |

Origem: Google Fonts (Archivo, de Omnibus-Type). Licença: SIL Open Font License 1.1.

## Card de citação (`/og/citacao`)

No espírito dos lambes: citação em Lora itálica, atribuição em Oswald. Arquivos WOFF da Fontsource (subconjunto latino, que cobre o português e as aspas tipográficas).

| Arquivo               | Instância      | Uso no card                 |
| --------------------- | -------------- | --------------------------- |
| `Lora-Italic.woff`    | peso 400, itál | citação e aspas grandes     |
| `Lora-Regular.woff`   | peso 400       | obra de origem, "Trecho de" |
| `Oswald-Medium.woff`  | peso 500       | atribuição (caixa alta)     |
| `Oswald-Regular.woff` | peso 400       | endereço no rodapé          |

Origem: `@fontsource/lora` e `@fontsource/oswald` 5.3.0. Licença: SIL Open Font License 1.1 (`OFL-Lora.txt`, `OFL-Oswald.txt`).
