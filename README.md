# accessibility-test-suite

> **Archived (read-only).** This was an early standalone suite and is kept as it was. The maintained accessibility work is [a11y-aoda-audit](https://github.com/rizvihiqrar/qa-automation-platform/tree/main/packages/a11y-aoda-audit) in [qa-automation-platform](https://github.com/rizvihiqrar/qa-automation-platform): a before/after audit of a demo store against WCAG 2.0 AA (the standard Ontario's AODA requires), including two issues axe-core misses.

![CI](https://github.com/rizvihiqrar/accessibility-test-suite/actions/workflows/playwright.yml/badge.svg)

Automated accessibility tests using Playwright and [axe-core](https://github.com/dequelabs/axe-core). The suite scans three pages for WCAG 2.0 Level A and AA violations, checks ARIA labeling and keyboard navigation on the login form, and includes a negative control that proves the scanner catches a known gap.

---

## What It Tests

| File | Tests | What it checks |
|---|---|---|
| `page-scans.spec.js` | 5 | Full-page axe scans of the homepage, login, forgot-password, and authenticated pages (WCAG 2.0 A/AA tags). Also a login scan at mobile width (375×812). |
| `aria-roles.spec.js` | 5 | Labels on login inputs, accessible names on buttons and links, `lang` attribute on the login page, and a negative control on an unlabeled `<select>` |
| `keyboard-nav.spec.js` | 4 | Tab order on the login form, Enter-key submission, Tab reachability of homepage links, and login fields receiving focus |

**14 tests across 3 pages**: homepage, login, and forgot-password, plus the authenticated area reached through login.

The negative control (`Axe correctly detects missing label on unlabeled form control`) runs the `select-name` rule against `/dropdown`, where the `<select>` has no label. It fails if axe stops flagging the gap, so a passing run means the scanner works.

Tests run against [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public practice site with known accessibility gaps.

---

## Project Structure

```
├── tests/
│   ├── page-scans.spec.js
│   ├── aria-roles.spec.js
│   └── keyboard-nav.spec.js
├── utils/
│   └── a11yHelper.js      # scanPage wrapper, critical/serious filter, formatter
├── playwright.config.js   # baseURL, tags, and reporters
└── .github/workflows/     # GitHub Actions CI
```

---

## Quick Start

```bash
git clone https://github.com/rizvihiqrar/accessibility-test-suite.git
cd accessibility-test-suite
npm install
npx playwright install chromium

npm test            # all tests
npm run smoke       # @smoke tagged tests
npm run regression  # @regression tagged tests
```

No `.env` file is required.

---

## Scope and Limits

- **WCAG version:** axe is configured with the `wcag2a` and `wcag2aa` tags. These are the WCAG 2.0 A and AA rule sets. The tests do not claim WCAG 2.1 or 2.2 coverage.
- **Automated checks only:** axe catches only part of accessibility issues. Screen reader output, complex keyboard flows, and visual design still need manual testing.
- **Blocking threshold:** the full-page scans fail on `critical` and `serious` violations. Minor and moderate issues are reported but do not fail the build.

---

## CI/CD

GitHub Actions runs the suite on push. The badge above reflects the latest run.

---

## Tech Stack

- **Playwright**: browser automation and test runner
- **axe-core** (`@axe-core/playwright`): accessibility rules engine
- **GitHub Actions**: CI
