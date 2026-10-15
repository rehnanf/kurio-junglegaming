
import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');

  await page.locator('#login-email').fill('contato@mail.com');
  await page.locator('#login-password').fill('123456');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL('/');
}

async function expireSession(page: Page) {
  await page.evaluate(async () => {
    const token = window.localStorage.getItem('kurio.session.token');

    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }

    const response = await fetch('/api/session/expire', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Falha ao expirar sessão: HTTP ${response.status}`
      );
    }
  });
}

test.describe('Expiração de sessão (CHALLENGE §3.6 e §9.3)', () => {
  test(
    'POST /api/session/expire derruba sessão e redireciona ao navegar para rota privada',
    async ({ page }) => {
      // 1. Realiza o login.
      await login(page);

      // 2. Expira a sessão na API simulada.
      await expireSession(page);

      // 3. Tenta acessar uma rota protegida.
      await page.goto('/profile');

      // 4. Verifica o redirecionamento para o login.
      await expect(page).toHaveURL(/\/login/, {
        timeout: 10_000,
      });

      // 5. Verifica se o destino original foi preservado.
      await expect(page).toHaveURL(/redirect=%2Fprofile/);
    }
  );

  test(
    'token em localStorage é removido após 401',
    async ({ page }) => {
      // 1. Realiza o login.
      await login(page);

      // 2. Confirma que existe um token.
      const tokenBefore = await page.evaluate(() =>
        window.localStorage.getItem('kurio.session.token')
      );

      expect(tokenBefore).toBeTruthy();

      // 3. Expira a sessão na API simulada.
      await expireSession(page);

      // 4. Acessa uma rota protegida para provocar
      // a validação da sessão expirada.
      await page.goto('/profile');

      // 5. Aguarda o redirecionamento para login.
      await expect(page).toHaveURL(/\/login/, {
        timeout: 10_000,
      });

      // 6. Verifica se o token foi removido.
      // expect.poll aguarda automaticamente,
      // sem depender de um tempo fixo.
      await expect
        .poll(
          async () => {
            return page.evaluate(() =>
              window.localStorage.getItem('kurio.session.token')
            );
          },
          {
            timeout: 10_000,
            message:
              'O token deve ser removido após a expiração da sessão.',
          }
        )
        .toBeNull();
    }
  );
});
