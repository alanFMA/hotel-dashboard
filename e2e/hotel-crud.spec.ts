import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { signInWithGoogleEmulator } from './support/googleAuth';
import { clearFirestoreEmulatorData } from './support/firestoreEmulator';

test.beforeEach(async ({ page }) => {
  await clearFirestoreEmulatorData();
  await page.goto('/login');
  await signInWithGoogleEmulator(page, `crud-${Date.now()}@example.com`);
  await expect(page).toHaveURL('/');
});

async function fillHotelForm(page: Page) {
  await page.getByLabel('Nome do hotel').fill('Ocean Cliff Resort');
  await page
    .getByLabel('Descrição')
    .fill('A serene cliffside escape with panoramic ocean views.');
  await page.getByLabel('Localização').fill('Florianópolis, Brazil');
  await page.getByLabel('URL da imagem').fill('https://picsum.photos/seed/ocean/800/450');
  await page.getByLabel('Preço por diária (R$)').fill('1250');
  await page.getByLabel('Classificação (estrelas)').selectOption('5');
  await page.getByLabel('Nota de avaliação (0 a 10)').fill('9.4');
}

test('creates, edits and deletes a hotel end to end', async ({ page }) => {
  await page.getByRole('button', { name: 'Cadastrar hotel' }).click();
  await fillHotelForm(page);
  await page.getByRole('button', { name: 'Cadastrar hotel' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Ocean Cliff Resort' })).toBeVisible();

  await page.getByRole('heading', { name: 'Ocean Cliff Resort' }).click();
  await expect(page).toHaveURL(/\/hotels\//);

  await page.getByLabel('Preço por diária (R$)').fill('999');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByText(/R\$\s*999,00/)).toBeVisible();

  await page.getByRole('button', { name: 'Excluir' }).click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Excluir' }).click();

  await expect(page.getByText('Nenhum hotel encontrado')).toBeVisible();
});
