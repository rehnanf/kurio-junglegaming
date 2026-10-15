import { test, expect } from '@playwright/test';

test.describe('Carrinho no layout do Figma', () => {
  test('visitante altera quantidade, persiste após refresh e remove NFT', async ({ page }) => {
    await page.goto('/nft/nft-042-0');
    await expect(page.getByRole('button', { name: /Adicionar ao carrinho/i })).toBeVisible();
    await page.getByRole('button', { name: /Adicionar ao carrinho/i }).click();
    await expect(page.getByRole('link', { name: /Carrinho de NFTs, 1 item/i })).toBeVisible();
    await page.goto('/cart');

    await expect(page.getByRole('heading', { name: 'Resumo da carteira' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Colecionadores também viram' })).toBeVisible();
    await page.getByRole('button', { name: 'Aumentar quantidade' }).first().click();
    await expect(page.locator('[aria-label="Quantidade: 2"]:visible')).toBeVisible();
    await expect(page.getByRole('link', { name: /Carrinho de NFTs, 2 itens/i })).toBeVisible();

    await page.reload();
    await expect(page.locator('[aria-label="Quantidade: 2"]:visible')).toBeVisible();
    await page.getByRole('button', { name: 'Remover do carrinho' }).first().click();
    await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
  });

  test('resumo do carrinho autenticado permite aplicar e remover cupom', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#login-email').fill('contato@mail.com');
    await page.locator('#login-password').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL('/');

    await page.goto('/nft/nft-042-0');
    await page.getByRole('button', { name: /Adicionar ao carrinho/i }).click();
    await expect(page.getByRole('link', { name: /Carrinho de NFTs, 1 item/i })).toBeVisible();
    await page.goto('/cart');

    await expect(page.getByRole('link', { name: 'Conectar e finalizar' })).toBeVisible();
    await page.getByLabel('Código promocional').fill('KURIO10');
    await page.getByRole('button', { name: 'Aplicar' }).click();
    await expect(page.getByRole('button', { name: 'Remover cupom' })).toBeVisible();
    await page.getByRole('button', { name: 'Remover cupom' }).click();
    await expect(page.getByRole('button', { name: 'Remover cupom' })).toHaveCount(0);
  });
});
