
import { test, expect } from '@playwright/test';

/*
 * Verifies theme toggle functionality:
 * - Starts with a known theme state
 * - Toggles between light and dark mode
 * - Asserts theme changes correctly
 */

test('user can toggle theme between light and dark mode', async ({ page }) => {
  // Clear theme preference so we observe changes deterministically
  await page.addInitScript(() => localStorage.removeItem('app-theme'));

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(600);

  const hasDark = async () => (await page.locator('html').getAttribute('class'))?.includes('dark') || false;
  const initialDark = await hasDark();
  console.log('Initial dark mode:', initialDark);

  const toggleLabel = page.getByTestId('theme-toggle-label');
  await toggleLabel.click();
  await page.waitForTimeout(600);

  const afterFirst = await hasDark();
  expect(afterFirst).toBe(!initialDark);

  await toggleLabel.click();
  await page.waitForTimeout(600);

  const afterSecond = await hasDark();
  expect(afterSecond).toBe(initialDark);

  await page.pause();
});