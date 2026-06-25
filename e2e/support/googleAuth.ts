import type { Page } from '@playwright/test';

export async function signInWithGoogleEmulator(page: Page, email: string): Promise<void> {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Entrar com o Google' }).click(),
  ]);

  await popup.waitForLoadState('networkidle');
  await popup.getByText('Add new account').click();
  await popup.locator('input').first().fill(email);
  await popup.getByRole('button', { name: /Sign in with Google/i }).click();
  await popup.waitForEvent('close');
}
