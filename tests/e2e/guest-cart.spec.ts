import { test, expect } from '@playwright/test';

test.describe('Carrinho visitante (CHALLENGE §3.4)', () => {
  test('visitante adiciona NFT, vê carrinho local com nome do NFT e preserva após login', async ({ page }) => {
    await page.goto('/nft/nft-042-0');

    await page
      .getByRole('button', {
        name: /Comprar NFT|Adicionar ao carrinho/i,
      })
      .click();

    // Aguarda a confirmação de que o carrinho recebeu o item.
    await expect(
      page.getByRole('link', {
        name: /Carrinho de NFTs, 1 item/i,
      })
    ).toBeVisible({ timeout: 10000 });

    await page.goto('/cart');

    const nftNoCarrinho = page
      .locator('a.kurio-cart-item-title:visible')
      .filter({ hasText: /Emerald Ape\s*#042/i });

    // NFT presente no carrinho do visitante.
    await expect(nftNoCarrinho).toBeVisible();

    await page.goto('/login');
    await page.locator('#login-email').fill('contato@mail.com');
    await page.locator('#login-password').fill('123456');

    await page
      .getByRole('button', { name: 'Entrar', exact: true })
      .click();

    await expect(page).toHaveURL('/');

    await page.goto('/cart');

    // NFT preservado após autenticação.
    await expect(nftNoCarrinho).toBeVisible();
  });
});