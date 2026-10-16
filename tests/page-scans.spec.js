import { test, expect } from '@playwright/test';
import { scanPage, getCriticalViolations, formatViolations } from '../utils/a11yHelper.js';

const WCAG_TAGS = ['wcag2a', 'wcag2aa'];

async function login(page) {
  await page.goto('/login');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('[type="submit"]');
  await page.waitForURL(/secure/, { timeout: 15000 });
}

test.describe('WCAG 2.0 A/AA — full-page axe scans', () => {

  test('Homepage has no critical or serious violations @smoke', async ({ page }) => {
    await page.goto('/');
    const { violations } = await scanPage(page, { tags: WCAG_TAGS });
    const blocking = getCriticalViolations(violations);
    if (violations.length) console.log('All violations:\n' + formatViolations(violations));
    expect(blocking, `Blocking violations:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('Login page has no critical or serious violations @smoke', async ({ page }) => {
    await page.goto('/login');
    const { violations } = await scanPage(page, { tags: WCAG_TAGS });
    const blocking = getCriticalViolations(violations);
    if (violations.length) console.log('All violations:\n' + formatViolations(violations));
    expect(blocking, `Blocking violations:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('Secure area (authenticated page) has no critical or serious violations @regression', async ({ page }) => {
    await login(page);
    const { violations } = await scanPage(page, { tags: WCAG_TAGS });
    const blocking = getCriticalViolations(violations);
    if (violations.length) console.log('All violations:\n' + formatViolations(violations));
    expect(blocking, `Blocking violations:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('Forgot password page has no critical or serious violations @regression', async ({ page }) => {
    await page.goto('/forgot_password');
    const { violations } = await scanPage(page, { tags: WCAG_TAGS });
    const blocking = getCriticalViolations(violations);
    if (violations.length) console.log('All violations:\n' + formatViolations(violations));
    expect(blocking, `Blocking violations:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('Login page has no critical violations at mobile viewport (375×812) @regression', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    const { violations } = await scanPage(page, { tags: WCAG_TAGS });
    const blocking = getCriticalViolations(violations);
    if (violations.length) console.log('Mobile viewport violations:\n' + formatViolations(violations));
    expect(blocking, `Blocking violations:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

});
