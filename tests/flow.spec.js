import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const email = `test+${timestamp}@example.com`;
const password = 'TestPass123!';

test('user signup, company registration, and login', async ({ page }) => {
  // Sign up a new user
  await page.goto('/signup.html');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/register-company.html');
  await expect(page).toHaveURL(/register-company\.html/);

  // Register company
  await page.fill('#name', 'Test Company');
  await page.fill('#address', '123 Testing Way');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard.html');
  await expect(page).toHaveURL(/dashboard\.html/);
  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Log out
  await page.click('#logout');
  await page.waitForURL('**/index.html');

  // Log back in
  await page.goto('/login.html');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard.html');
  await expect(page).toHaveURL(/dashboard\.html/);
  await expect(page.locator('text=Dashboard')).toBeVisible();
});
