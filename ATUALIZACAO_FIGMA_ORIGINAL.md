# Atualização visual KURIO — referências do Figma

Esta atualização foi produzida a partir das nove capturas de referência, do SVG exportado do Figma e das propriedades CSS fornecidas.

## Artes originais

O SVG incluía quatro imagens PNG embutidas em base64, com resolução nativa de 1254 × 1254 px. Elas foram extraídas e otimizadas para WebP (qualidade 90) para evitar imagens desfocadas sem tornar o carregamento pesado:

- `/public/assets/kurio-green.webp` — Emerald Ape
- `/public/assets/kurio-gray.webp` — Sage Nomad / Cosmic Bloom / Violet Nomad
- `/public/assets/kurio-black.webp` — Neon Vessel / Ivory Baron
- `/public/assets/kurio-gold.webp` — Golden Beat / Golden Signal

O Figma fornece quatro retratos distintos, mas o mock contém mais NFTs. Assim, algumas imagens se repetem. Não são geradas artes inexistentes.

## O que foi ajustado

- Tipografia global Roboto Mono, paleta exata `#140D0A`, `#241612`, `#D28A4C`, `#F5F1EB` e `#CFB28C`.
- Conteúdo central de 1200px no desktop, cabeçalho de 45px, hero 450px, catálogo com sidebar de 310px.
- Cards com retratos nítidos e contêineres de fundo marrom; nove cards por página.
- Blocos editoriais, Diário da Cunhagem e rodapé em quatro colunas como no Figma.
- Ajustes de apresentação para carrinho, detalhe, checkout, perfil, carteiras e recibo.
- Formulário secundário de carteira e opções de sessão permanecem disponíveis em seções expansíveis.

## Histórico de aplicação (etapa anterior à entrega)

1. Faça cópia da pasta do projeto.
2. Extraia o ZIP de correções na raiz da pasta `kurio-junglegaming` e confirme a substituição dos arquivos.
3. Execute `npm run typecheck`, `npm run lint`, `npm run build` e `npm run dev`.
4. Compare as telas em 1440px de largura. A execução dos testes Playwright depende do ambiente local.
5. Somente depois da conferência visual, atualize os snapshots com `npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots --workers=1`.

## Limitações registradas na atualização visual original

A fidelidade visual pixel a pixel **não foi verificada por captura automatizada** nesta sessão. A lógica de mock possui nomes, preços e edições que nem sempre coincidem com os valores ilustrativos do Figma; esses dados foram preservados para não quebrar o comportamento da API. Os testes TypeScript, lint e E2E devem ser executados no seu ambiente Windows.
