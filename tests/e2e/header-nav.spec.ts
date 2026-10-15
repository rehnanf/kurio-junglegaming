import { test, expect, type Page } from '@playwright/test';

async function openMobileNavIfNeeded(page: Page) {
  // Aguarda o catálogo carregar antes de abrir o menu; evita reset do header durante a inicialização.
  await expect(page.getByText(/Mostrando \d+ de \d+ NFTs/i)).toBeVisible({ timeout: 15_000 });
  const toggle = page.getByRole('button', { name: 'Abrir menu de navegação' });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('#kurio-mobile-nav')).toBeVisible();
  }
}

test.describe('Header — navegação principal', () => {
  test('"Início" navega para / sem query e fica ativo', async ({ page }) => {
    await page.goto('/?sort=trending');
    await openMobileNavIfNeeded(page);
    const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Início' });
    await link.click();
    await expect(page).toHaveURL(/\/\?$|\/$/);
    await openMobileNavIfNeeded(page);
    await expect(link).toHaveAttribute('aria-current', 'page');
  });

  test('"Mercado" navega para /?sort=trending e fica ativo', async ({ page }) => {
    await page.goto('/');
    await openMobileNavIfNeeded(page);
    const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Mercado' });
    await link.click();
    await expect(page).toHaveURL(/sort=trending/);
    await openMobileNavIfNeeded(page);
    await expect(link).toHaveAttribute('aria-current', 'page');
  });

  test('"Início" não está ativo quando Mercado está ativo, e vice-versa', async ({ page }) => {
    await page.goto('/?sort=trending');
    await openMobileNavIfNeeded(page);
    const inicio = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Início' });
    const mercado = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Mercado' });
    await expect(mercado).toHaveAttribute('aria-current', 'page');
    await expect(inicio).not.toHaveAttribute('aria-current', 'page');

    await inicio.click();
    await openMobileNavIfNeeded(page);
    await expect(inicio).toHaveAttribute('aria-current', 'page');
    await expect(mercado).not.toHaveAttribute('aria-current', 'page');
  });

  test('"Criadores" mostra toast "em breve" e não navega', async ({ page }) => {
    await page.goto('/');
    const urlBefore = page.url();
    await openMobileNavIfNeeded(page);
    const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('button', { name: 'Criadores' });
    await link.click();
    await expect(page.getByText(/Página de criadores em breve/i)).toBeVisible({ timeout: 4_000 });
    expect(page.url()).toBe(urlBefore);
  });

  test('"Aprenda" mostra toast "em breve" e não navega', async ({ page }) => {
    await page.goto('/');
    const urlBefore = page.url();
    await openMobileNavIfNeeded(page);
    const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('button', { name: 'Aprenda' });
    await link.click();
    await expect(page.getByText(/Central educativa em breve/i)).toBeVisible({ timeout: 4_000 });
    expect(page.url()).toBe(urlBefore);
  });
});
