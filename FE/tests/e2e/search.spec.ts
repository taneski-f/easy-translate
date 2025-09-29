import { test, expect } from '@playwright/test';

/**
 * Tests the project search functionality:
 * - Counts initial projects
 * - Filters projects by search term
 * - Verifies the filtered count is less than or equal to initial
 * - Clears the search and checks the count returns to initial
 */

test('filters projects by search term and resets', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(800);

  const projectsSection = page.getByTestId('projects-section');
  const projects = projectsSection.locator('[data-testid="project-card"]');
  const initialProjects = await projects.count();
  console.log('Initial project count:', initialProjects);

  const searchInput = projectsSection.getByTestId('search-input');
  await searchInput.fill('Easy');
  await page.waitForTimeout(600);

  const filteredProjects = await projects.count();
  console.log('Filtered project count:', filteredProjects);
  expect(filteredProjects).toBeLessThanOrEqual(initialProjects);

  await searchInput.fill('');
  await page.waitForTimeout(600);

  const finalProjects = await projects.count();
  expect(finalProjects).toBe(initialProjects);

  await page.pause();
});