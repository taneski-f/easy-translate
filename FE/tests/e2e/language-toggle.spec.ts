import { test, expect } from '@playwright/test';

/**
 * Tests the language toggle feature:
 * - Starts in English and verifies key headings
 * - Switches to Danish and checks translations
 * - Reloads the page to confirm Danish persists
 */

test('switches language to Danish and persists after reload', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      if (!window.sessionStorage.getItem('cleared-locale')) {
        window.localStorage.removeItem('app-locale');
        window.sessionStorage.setItem('cleared-locale', '1');
      }
    } catch (e) {
      console.log(e);
    }
  });

  await page.goto('http://localhost:5173');

  await expect(page.getByRole('heading', { name: 'My Workspace' })).toBeVisible();
  await expect(page.getByText('Your Folders')).toBeVisible();
  await expect(page.getByText('Workspace Projects')).toBeVisible();

  const footer = page.getByRole('contentinfo');
  const languageToggle = footer.getByTestId('language-toggle');
  await expect(languageToggle).toBeVisible();

  await languageToggle.getByTestId('lang-button-da').click();

  await expect(page.getByRole('heading', { name: 'Mit Arbejdsområde' })).toBeVisible();
  await expect(page.getByText('Dine Mapper')).toBeVisible();
  await expect(page.getByText('Arbejdsområdesprojekter')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Mit Arbejdsområde' })).toBeVisible();

  await page.pause();
});
