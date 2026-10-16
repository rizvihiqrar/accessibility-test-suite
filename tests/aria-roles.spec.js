import { test, expect } from '@playwright/test';
import { scanPage, formatViolations } from '../utils/a11yHelper.js';

test.describe('ARIA roles and attributes', () => {

  test('Login form inputs have associated <label> elements @regression', async ({ page }) => {
    await page.goto('/login');
    const { violations } = await scanPage(page, { rules: ['label'] });
    const labelViolations = violations.filter(v => v.id === 'label');
    expect(labelViolations, `Label violations:\n${formatViolations(labelViolations)}`).toHaveLength(0);
  });

  test('Login page buttons have accessible names @regression', async ({ page }) => {
    await page.goto('/login');
    const { violations } = await scanPage(page, { rules: ['button-name'] });
    const buttonViolations = violations.filter(v => v.id === 'button-name');
    expect(buttonViolations, `Unnamed buttons:\n${formatViolations(buttonViolations)}`).toHaveLength(0);
  });

  test('Homepage links have accessible names @regression', async ({ page }) => {
    await page.goto('/');
    const { violations } = await scanPage(page, { rules: ['link-name'] });
    const linkViolations = violations.filter(v => v.id === 'link-name');
    expect(linkViolations, `Unnamed links:\n${formatViolations(linkViolations)}`).toHaveLength(0);
  });

  test('HTML lang attribute is declared on the login page @regression', async ({ page }) => {
    await page.goto('/login');
    const { violations } = await scanPage(page, { rules: ['html-has-lang'] });
    const langViolations = violations.filter(v => v.id === 'html-has-lang');
    expect(langViolations, `Missing lang attribute:\n${formatViolations(langViolations)}`).toHaveLength(0);
  });

  test('Axe correctly detects missing label on unlabeled form control @regression', async ({ page }) => {
    // The /dropdown page has a <select> with no associated <label> — a known a11y gap.
    // This test validates that our scanner correctly flags it (negative/detection test).
    await page.goto('/dropdown');
    const { violations } = await scanPage(page, { rules: ['select-name'] });
    const labelViolations = violations.filter(v => v.id === 'select-name');
    expect(
      labelViolations.length,
      'Expected axe to flag the unlabeled <select> on /dropdown'
    ).toBeGreaterThan(0);
  });

});
