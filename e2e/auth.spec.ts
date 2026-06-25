import { expect, test } from '@playwright/test';
import { signInWithGoogleEmulator } from './support/googleAuth';
import { clearFirestoreEmulatorData } from './support/firestoreEmulator';

test.beforeEach(async () => {
  await clearFirestoreEmulatorData();
});

test.describe('Authentication', () => {
  test('redirects unauthenticated users to the login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('signs in with Google and reaches the dashboard', async ({ page }) => {
    await page.goto('/login');

    await signInWithGoogleEmulator(page, `clara-${Date.now()}@example.com`);

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Hotéis' })).toBeVisible();
  });

  test('signs out and is redirected back to login when visiting a private route', async ({
    page,
  }) => {
    await page.goto('/login');
    await signInWithGoogleEmulator(page, `clara-${Date.now()}@example.com`);
    await expect(page).toHaveURL('/');

    await page.getByRole('button', { name: 'Sair' }).click();
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
  });
});
