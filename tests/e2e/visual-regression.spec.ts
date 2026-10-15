import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.locator('#login-email').fill('contato@mail.com');
  await page.locator('#login-password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/');
}

test.describe('Regressão visual (CHALLENGE §9)', () => {
  test('home (catálogo)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Mostrando \d+ de \d+ NFTs/i)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveScreenshot('home.png', { fullPage: true, animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.02 });
  });

  
test('detalhe do NFT', async ({ page }) => {
  await page.goto('/nft/nft-042-0');

  // Aguarda os dados principais da página.
  await expect(
    page.getByRole('heading', {
      name: /Emerald Ape #042/i,
    })
  ).toBeVisible({ timeout: 15_000 });

  // Aguarda o carregamento das imagens da página.
  await page.evaluate(async () => {
    await document.fonts.ready;

    const images = Array.from(document.images);

    await Promise.all(
      images.map(async (image) => {
        image.loading = 'eager';
        await image.decode();
      })
    );
  });

  // Captura a página após o carregamento dos recursos.
  await expect(page).toHaveScreenshot('nft-detail.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02,
    timeout: 20_000,
  });
});


  test('carrinho autenticado', async ({ page }) => {
    await login(page);
    await page.goto('/nft/nft-042-0');
    await expect(page.getByRole('heading', { name: /Emerald Ape #042/i })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /Adicionar ao carrinho/i }).click();
    // A mutação é assíncrona: só navega depois de o servidor confirmar a inclusão.
    await expect(page.getByRole('link', { name: /Carrinho de NFTs, 1 item/i })).toBeVisible({ timeout: 15_000 });
    await page.goto('/cart');
    await expect(page.locator('a.kurio-cart-item-title:visible').filter({ hasText: /Emerald Ape/i }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true, animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.02 });
  });

  test('login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByText(/Mostrando \d+ de \d+ NFTs/i)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveScreenshot('login.png', { fullPage: true, animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.02 });
  });
});
