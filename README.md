# Kurio — NFT Marketplace

Marketplace **demonstrativo** implementado para o desafio técnico de frontend da **Jungle Gaming**, com interface inspirada no Figma fornecido e fluxos completos de ponta a ponta. A marca **Kurio** foi adotada conforme os materiais de referência do Figma.

> **Importante:** os NFTs, usuários, carteiras, pagamentos, autenticação e eventos em tempo real são **simulados** por mocks. Não há blockchain, transações financeiras ou backend real nesta demonstração.

## Funcionalidades

- **Catálogo:** listagem de NFTs, filtros, ordenação, busca, paginação e estado persistido na URL.
- **Detalhes de NFT:** atributos, quantidades, preço atualizado e favoritos.
- **Conta:** login e cadastro fictícios, edição de perfil e senha, gerenciamento de carteiras e expiração de sessão.
- **Carrinho:** operação como visitante, persistência local, mesclagem após login, alterações de quantidade e cupons.
- **Checkout e pedidos:** validações, idempotência, recuperação após timeout, confirmação ou rejeição simulada.
- **Tempo real:** alterações de preços e estados de pedidos via Socket.IO simulado, com reconciliação de eventos antigos/duplicados.
- **Interface:** layouts responsivos, estados de carregamento/erro/vazio, acessibilidade e baselines de regressão visual.

## Tecnologias

React 18, TypeScript, Vite, TanStack Router, TanStack Query, Axios, Tailwind CSS, componentes no estilo shadcn/ui e Radix, MSW 2, Socket.IO Client + `@mswjs/socket.io-binding`, Playwright e Lighthouse CI.

## Executar localmente

**Requisitos:** Node.js 22 (consulte `.nvmrc`) e npm. Não há necessidade de backend externo.

No **Windows PowerShell**:

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

No **macOS/Linux**:

```bash
cp .env.example .env
npm ci
npm run dev
```

Acesse a URL mostrada pelo Vite (geralmente `http://localhost:5173`). `npm ci` executa o `postinstall`, que também gera o worker do MSW. Os arquivos `public/mockServiceWorker.js` e `src/routeTree.gen.ts` estão versionados para facilitar builds em clones limpos.

**Credenciais fictícias:**

| Conta | Senha | Perfil |
| --- | --- | --- |
| `contato@mail.com` | `123456` | Sabrina Novaes |
| `joao@mail.com` | `123456` | João Varella |

Essas senhas são **somente de teste** e fazem parte dos fixtures públicos. Não utilize dados reais.

## Variáveis de ambiente

Crie `.env` copiando `.env.example` (não versione o `.env`). Como o Vite lê as variáveis `VITE_*` em tempo de compilação, reinicie o servidor após alterá-las.

| Variável | Padrão no exemplo | Descrição |
| --- | --- | --- |
| `VITE_ENABLE_MOCKS` | `true` | Habilita a API e o Socket.IO simulados |
| `VITE_API_BASE_URL` | `/api` | Prefixo de requisições REST |
| `VITE_SOCKET_URL` | `/socket.io` | URL usada pelo cliente Socket.IO |
| `VITE_NETWORK_PROFILE` | `standard` | `standard`, `slow`, `flaky` ou `offline` |

### Simular cenários

- **Rede lenta:** configure `VITE_NETWORK_PROFILE=slow` no `.env` e reinicie o Vite.
- **Rede instável:** configure `VITE_NETWORK_PROFILE=flaky`.
- **Falhas de conectividade:** configure `VITE_NETWORK_PROFILE=offline`.
- **Sessão expirada:** `POST /api/session/expire` com o token da conta autenticada e tente visitar `/profile`.
- **Preço alterado:** `POST /api/_debug/nft-price` com `{ "nftId": "nft-042-0", "factor": 1.1 }`.
- **Pedido rejeitado:** `POST /api/_debug/order-reject` com `{ "orderId": "ID_DO_PEDIDO", "reason": "simulated" }`.
- **Reset do mock:** `POST /api/_debug/reset`. Como o mock mantém estado no navegador, dados locais persistidos podem exigir limpeza do armazenamento do site para um reset completo.

Esses endpoints existem **apenas enquanto os mocks estão habilitados**. As alterações de rede são configuradas por ambiente, não pelo menu da aplicação.

## Comandos

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia Vite em modo de desenvolvimento |
| `npm run typecheck` | Valida TypeScript |
| `npm run lint` | Executa ESLint |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build local (porta 4173) |
| `npm run test:e2e` | Executa a suíte Playwright (Chromium desktop e mobile) |
| `npm run test:e2e:report` | Abre o relatório do Playwright |
| `npm run lighthouse:desktop` | Coleta Lighthouse desktop |
| `npm run lighthouse:mobile` | Coleta Lighthouse mobile |

Para repetir os testes com os mocks ativos:

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

**Resultado mais recente informado na validação Windows:** **98 testes aprovados**, **0 falhas**, executados nos projetos `chromium-desktop` e `chromium-mobile` (15/10/2026). Esse resultado refere-se aos testes E2E antes dos ajustes de documentação/configuração para publicação e **não substitui** o teste do deploy definitivo.

### Regressão visual

Os oito snapshots atuais, correspondentes ao layout utilizado, estão em `tests/e2e/visual-regression.spec.ts-snapshots/` e foram capturados no **Windows** (`*-win32.png`). A comparação visual é específica de sistema operacional e renderização; para outro sistema, gere referências *somente após comparar a interface*:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots --workers=1
```

**Nunca atualize snapshots somente para esconder uma falha de layout.**

## Lighthouse

O desafio solicita três auditorias de **catálogo e detalhe de NFT**, em **desktop e mobile**, com **HTML/JSON** e mediana das categorias. O repositório contém as configurações de coleta; **os relatórios de execução não estão incluídos no pacote revisado** e devem ser gerados antes da entrega final, caso exigidos pelo avaliador.

Com os mocks ativos no build (`.env` configurado) e com `npm run preview` em outro terminal:

```bash
npm run lighthouse:desktop
npm run lighthouse:mobile
```

Os arquivos HTML/JSON de cada perfil são exportados em `lighthouse-reports/` (ignorados pelo Git). Anexe os relatórios exigidos pela avaliação separadamente ou em uma pasta versionada específica após conferir que não contêm dados sensíveis. Metas da seção §10: Performance ≥90, Acessibilidade ≥95, Boas Práticas ≥95 e SEO ≥90.

## Deploy na Vercel

O projeto é **SPA estática** com build Vite e mocks no navegador. A configuração `vercel.json` define:

- `npm run build`, diretório de saída `dist/`, framework `vite`;
- `VITE_ENABLE_MOCKS=true` e `VITE_NETWORK_PROFILE=standard` no **build**;
- reescrita das rotas SPA para `index.html` e headers para arquivos estáticos.

Para publicar, importe o repositório no [painel da Vercel](https://vercel.com/new) e execute o deploy. Como boa prática, revise também as variáveis do projeto em **Settings → Environment Variables**. Não é necessário apontar `/api` para um servidor externo: o MSW intercepta essas requisições no navegador.

**Após o deploy**, confira a página inicial, acesso direto a `/nft/nft-042-0`, `/login`, `/cart` e `/profile`, cadastro/login fictício, compra simulada, atualização do pedido e o carregamento de `/mockServiceWorker.js`. Configure metadados de domínio (canonical, `og:url` e sitemap) **somente depois de definir a URL permanente**.

**URL de produção:** a incluir após validar o deploy permanente.

## Estrutura e documentação

```text
src/api/               Cliente Axios, endpoints e query keys
src/app/               Providers globais
src/components/        Interface, componentes reutilizáveis e navegação
src/hooks/             Hooks de sessão, carrinho, favoritos, perfil e socket
src/lib/               Utilitários e persistência do carrinho convidado
src/mocks/             Fixtures, handlers MSW, estado e socket mock
src/routes/            Rotas TanStack Router
src/types/             Contratos e tipos
public/                Assets, favicon e Service Worker de mocks
tests/e2e/             Playwright + snapshots Windows
design/frames/          Capturas de referência do Figma
```

Consulte `ARCHITECTURE.md` para decisões sobre REST, sessão, estado local, cache, idempotência, Socket.IO, UX e limitações conhecidas. `CHALLENGE.md` contém os requisitos originais do desafio. `ENTREGA_CHECKLIST.md` organiza as etapas finais de publicação.

## Limitações

- **Demonstração, não marketplace real:** pagamentos, NFTs, tokens e carteiras são fictícios, sem conexão on-chain.
- O estado do mock é simulado no navegador; não há backend multiusuário nem persistência remota real.
- Snapshots visuais versionados refletem o ambiente Windows; outros ambientes exigem baselines revisadas.
- O desempenho Lighthouse e o comportamento na URL pública devem ser aferidos **na versão publicada** antes da submissão.
