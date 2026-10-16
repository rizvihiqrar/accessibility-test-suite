import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation', () => {

  test('Login form fields tab in correct order: username → password → submit @regression', async ({ page }) => {
    await page.goto('/login');

    // Explicitly focus the username field, then tab through the form
    const usernameField = page.locator('#username');
    await usernameField.focus();
    await expect(usernameField).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[type="submit"]')).toBeFocused();
  });

  test('Login form can be submitted with the Enter key @regression', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/secure/, { timeout: 10000 });
  });

  test('Homepage navigation links are reachable by Tab @regression', async ({ page }) => {
    await page.goto('/');

    // Tab through the page and count how many focusable interactive elements are reached
    const focusedTags = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase() ?? '');
      if (tag) focusedTags.push(tag);
    }

    const interactiveCount = focusedTags.filter(t => ['a', 'button', 'input', 'select'].includes(t)).length;
    expect(interactiveCount).toBeGreaterThan(4);
  });

  test('Login page inputs can receive focus and are visible when focused @regression', async ({ page }) => {
    await page.goto('/login');

    const usernameField = page.locator('#username');
    await usernameField.focus();
    await expect(usernameField).toBeFocused();
    await expect(usernameField).toBeVisible();

    const passwordField = page.locator('#password');
    await passwordField.focus();
    await expect(passwordField).toBeFocused();
    await expect(passwordField).toBeVisible();
  });

});
