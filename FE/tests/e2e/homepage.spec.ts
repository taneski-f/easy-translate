import { test, expect } from '@playwright/test';

/**
 * Verifies that the homepage loads and all main UI elements are visible using data-testid selectors:
 * - Projects and folders sections
 * - Section headers
 * - Create buttons
 * - Theme and language toggles
 */

test('homepage shows all main UI elements (data-testid)', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    await expect(page).toHaveTitle(/EasyTranslate/);

        // Projects section
        const projectsSection = page.getByTestId('projects-section');
        await expect(projectsSection).toBeVisible();
        await expect(projectsSection.getByTestId('projects-list')).toBeVisible();
        await expect(projectsSection.getByTestId('create-project-button')).toBeVisible();

        // Folders section
        const foldersSection = page.getByTestId('folders-section');
        await expect(foldersSection).toBeVisible();
        await expect(foldersSection.getByTestId('folders-list')).toBeVisible();
        await expect(foldersSection.getByTestId('create-folder-button')).toBeVisible();

        // Theme toggle
        await expect(page.getByTestId('theme-toggle')).toBeVisible();
        await expect(page.getByTestId('theme-toggle-label')).toBeVisible();

        // Language toggle
        await expect(page.getByTestId('language-toggle')).toBeVisible();
        await expect(page.getByTestId('lang-button-en')).toBeVisible();
        await expect(page.getByTestId('lang-button-da')).toBeVisible();

        await page.pause();
});
