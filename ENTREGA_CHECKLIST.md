# Checklist de entrega — Jungle Gaming

## Status da revisão do pacote

- [x] Estrutura de código, dependências, testes e assets presentes.
- [x] `package.json` e `package-lock.json` coerentes (dependências e devDependencies).
- [x] `.gitignore` protege `.env*` e ignora artefatos de build, dependências e relatórios temporários.
- [x] `src/routeTree.gen.ts` e `public/mockServiceWorker.js` incluídos para instalação/build reproduzível.
- [x] README atualizado para 98 testes E2E informados como aprovados em Windows, em 15/10/2026.
- [x] Removidos links temporários do README e domínio fictício dos metadados/sitemap.
- [x] Configuração Lighthouse mobile adicionada à desktop existente.
- [ ] **Validar em clone limpo**: `Copy-Item .env.example .env`, `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`.
- [ ] Executar E2E na versão local final (teste informado anteriormente: 98/98 em Windows).
- [ ] Gerar e disponibilizar relatórios Lighthouse HTML/JSON desktop e mobile conforme CHALLENGE §10.
- [ ] Publicar no GitHub e revisar arquivos staged com `git status` / `git diff --cached --name-only`.
- [ ] Fazer deploy permanente na Vercel e testar rotas diretas, MSW, carrinho e checkout na URL pública.
- [ ] Acrescentar URL permanente ao README e, caso necessário, canonical/OG/sitemap.
- [ ] Enviar os links do GitHub e da aplicação publicados ao recrutador.

## Verificação no PowerShell

```powershell
Copy-Item .env.example .env
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

**Nota:** a inspeção desta revisão foi estática. O resultado 98/98 foi apresentado pelo candidato em seu Windows; não equivale a uma execução nova do Playwright no ambiente de revisão nem garante o funcionamento do site publicado.
