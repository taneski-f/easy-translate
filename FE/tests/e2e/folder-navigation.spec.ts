
import { test, expect } from '@playwright/test';

/*
 * Tests folder navigation:
 * - Finds a folder card by name
 * - Navigates to folder details
 * - Verifies details and back navigation
 */

test('user can click the Marketing 251 folder and navigate to details', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(800);

  const targetFolderName = 'Marketing 251';

  // Target the specific folder card by its visible name
  const folderCard = page
    .getByTestId('folder-card')
    .filter({ hasText: targetFolderName })
    .first();

  await expect(folderCard, `Folder card with name "${targetFolderName}" should be visible`).toBeVisible();

  const folderName = (await folderCard.getByTestId('folder-name').textContent())?.trim();
  console.log('Clicking folder:', folderName);

  await folderCard.click();
  await page.waitForTimeout(1200);

  expect(page.url()).toContain('folder');

  const backButton = page.getByTestId('back-to-folders');
  await expect(backButton).toBeVisible();

  await expect(page.getByTestId('folder-title')).toHaveText(targetFolderName);

  await backButton.click();
  await page.waitForTimeout(600);
  expect(page.url()).toBe('http://localhost:5173/');

  await page.pause();
});