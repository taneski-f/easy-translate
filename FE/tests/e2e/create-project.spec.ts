import { test, expect } from '@playwright/test';

/*
 * Simulates a failed project creation and verifies that an error toast appears.
 * - Opens the create project modal
 * - Fills in a project name and submits
 * - Asserts that an error toast with the correct message is shown
 */
test('shows error toast on failed project creation', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(800);

  await page.getByTestId('create-project-button').click();
  await page.getByRole('textbox', { name: /project name/i }).fill('sample');

  await page.getByRole('button', { name: /create project/i }).click();

  const toast = page.locator('[data-testid^="toast-item-"]');
  const firstToast = toast.first();
  await expect(firstToast).toBeVisible();
  const toastTitle = firstToast.locator('p.text-sm.font-semibold');
  await expect(toastTitle).toHaveText(/project creation failed/i);

  await page.pause();
});