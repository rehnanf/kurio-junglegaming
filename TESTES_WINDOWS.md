# Testes Playwright — Windows

A aplicação tem **98 execuções E2E aprovadas informadas em Windows (15/10/2026)**, incluindo projetos desktop e mobile. Confira novamente após publicar ou alterar código.

## Executar localmente

```powershell
Copy-Item .env.example .env
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

A configuração de `playwright.config.ts` inicia `npm run preview` na porta 4173. Se já houver um servidor antigo nessa porta, ele poderá ser reutilizado localmente; encerre servidores anteriores ou execute em um ambiente limpo para evitar testar um build errado.

## Screenshots

A suíte visual usa os baselines **Windows** atuais de catálogo, detalhe, carrinho e login em dois viewports. O Playwright usa sufixos específicos por projeto e sistema operacional (`-win32.png`). Outras plataformas precisam capturas próprias após conferência visual.

```powershell
npx playwright test tests/e2e/visual-regression.spec.ts --workers=1
```

**Não regenere snapshots para disfarçar defeitos visuais.** Para alterações intencionais e revisadas:

```powershell
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots --workers=1
```

Em caso de falha, inspecione o relatório e os traces:

```powershell
npx playwright show-report
```
