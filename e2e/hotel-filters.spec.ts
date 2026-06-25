import { expect, test } from '@playwright/test';
import { signInWithGoogleEmulator } from './support/googleAuth';
import { clearFirestoreEmulatorData } from './support/firestoreEmulator';

test.beforeEach(async ({ page }) => {
  await clearFirestoreEmulatorData();
  await page.goto('/login');
  await signInWithGoogleEmulator(page, `filters-${Date.now()}@example.com`);
  await expect(page).toHaveURL('/');

  await page.getByRole('button', { name: 'Cadastrar hotel' }).click();
  await page.getByLabel('Nome do hotel').fill('Ocean Cliff Resort');
  await page
    .getByLabel('Descrição')
    .fill('A serene cliffside escape with panoramic ocean views.');
  await page.getByLabel('Localização').fill('Florianópolis, Brazil');
  await page.getByLabel('URL da imagem').fill('https://picsum.photos/seed/ocean/800/450');
  await page.getByLabel('Preço por diária (R$)').fill('1250');
  await page.getByLabel('Classificação (estrelas)').selectOption('5');
  await page.getByLabel('Nota de avaliação (0 a 10)').fill('9.4');
  await page.getByRole('button', { name: 'Cadastrar hotel' }).click();

  await expect(page.getByRole('heading', { name: 'Ocean Cliff Resort' })).toBeVisible();
});

test('shows the empty state when the combined filters exclude every hotel', async ({ page }) => {
  await page.getByLabel('Buscar').fill('Ocean Cliff Resort');
  await expect(page.getByRole('heading', { name: 'Ocean Cliff Resort' })).toBeVisible();

  await page.getByLabel(/Máximo/).fill('500');

  await expect(page.getByText('Nenhum hotel encontrado')).toBeVisible();
});
