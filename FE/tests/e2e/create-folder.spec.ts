
import { test, expect } from '@playwright/test';

/*
 * Simulates folder creation and verifies success toast and list update:
 * - Opens create folder modal
 * - Fills in folder name and submits
 * - Asserts success toast and folder appears in list
 */

test('user can create a new folder and see it in the list', async ({ page }) => {
  const newFolderName = `My New Folder ${Date.now()}`;

  // Intercept POST /folders to simulate a successful creation - avoid polluting backend with test data
  await page.route('**/folders', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const response = {
        data: {
          id: String(Date.now()),
          type: 'project-folder',
          attributes: {
            name: newFolderName,
            total_projects: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) });
    }
    // pass through other methods (e.g., GET)
    return route.fallback();
  });

  await page.goto('http://localhost:5173/');
  const foldersSection = page.getByTestId('folders-section');
  await foldersSection.getByTestId('create-folder-button').click();
  
  await page.getByRole('textbox', { name: /folder name/i }).fill(newFolderName);
  await page.getByRole('button', { name: /create folder/i }).click();

  const successToast = page.getByTestId('toast-item-success').first();
  await expect(successToast).toBeVisible();
  await expect(successToast).toContainText(`Folder "${newFolderName}" created.`);

  // The newly created folder should be visible in the list
  const foldersList = foldersSection.getByTestId('folders-list');
  const createdCard = foldersList.getByTestId('folder-card').filter({ hasText: newFolderName }).first();
  await expect(createdCard).toBeVisible();
  await page.pause();
});
