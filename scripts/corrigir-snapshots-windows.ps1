# Execute na raiz do projeto: powershell -ExecutionPolicy Bypass -File .\scripts\corrigir-snapshots-windows.ps1
$ErrorActionPreference = 'Stop'
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))

if (-not (Test-Path 'package.json') -or -not (Test-Path 'tests/e2e/visual-regression.spec.ts')) {
  throw 'Projeto KURIO nao encontrado. Execute o script na raiz do projeto.'
}

function Run-Step([string]$Description, [string]$Executable, [string[]]$Arguments) {
  Write-Host "`n=== $Description ===" -ForegroundColor Cyan
  & $Executable @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Falhou: $Description (codigo $LASTEXITCODE)" }
}

Write-Host 'Atualizacao das referencias visuais KURIO no Windows' -ForegroundColor Yellow
Write-Host 'IMPORTANTE: as novas imagens passam a ser a referencia visual dos testes.'
Write-Host 'A aparencia atual deve ter sido conferida com o Figma antes da execucao.'

Run-Step 'ESLint' 'npm' @('run', 'lint')
Run-Step 'Build de producao' 'npm' @('run', 'build')
Run-Step 'Atualizar 8 snapshots desktop/mobile' 'npx' @('playwright', 'test', 'tests/e2e/visual-regression.spec.ts', '--update-snapshots', '--workers=1')
Run-Step 'Revalidar 8 snapshots' 'npx' @('playwright', 'test', 'tests/e2e/visual-regression.spec.ts', '--workers=1')
Run-Step 'Executar suite E2E completa' 'npm' @('run', 'test:e2e')

Write-Host "`nSUCESSO: testes concluidos. Confira e versione os PNGs em tests/e2e/visual-regression.spec.ts-snapshots/" -ForegroundColor Green
