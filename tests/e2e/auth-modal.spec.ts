import { test, expect } from '@playwright/test';

test.describe('Modal de autenticação (Figma)', () => {
  test('login abre sobre o catálogo real e pode ser fechado', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('dialog', { name: 'Entrar na Kurio' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Seja dono do futuro/i, includeHidden: true })).toBeVisible();
    await expect(page.locator('#login-email')).toBeVisible();
    await page.getByRole('button', { name: 'Fechar login' }).click();
    await expect(page).toHaveURL('/');
  });

  test('abas alternam entre login e cadastro sem perder redirect', async ({ page }) => {
    await page.goto('/login?redirect=%2Fcart');
    await page.getByRole('link', { name: 'Criar conta' }).click();
    await expect(page).toHaveURL(/\/register.*redirect/);
    await expect(page.getByRole('dialog', { name: 'Criar conta na Kurio' })).toBeVisible();
    await page.getByRole('link', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/login.*redirect/);
  });
});
