import { test, expect } from '@playwright/test';

const screens = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-modern', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const screen of screens) {
  test.describe(screen.name, () => {
    test.use({ viewport: { width: screen.width, height: screen.height }, isMobile: false });

    for (const path of ['/', '/leistungen', '/ueber-mich', '/kontakt']) {
      test(`${path} renders without horizontal overflow`, async ({ page }, testInfo) => {
        // The Turnstile backend challenge is intentionally not part of this UI test.
        await page.route('https://challenges.cloudflare.com/**', route => route.abort());
        await page.goto(path);
        await expect(page.locator('h1')).toBeVisible();
        await expect.poll(() => page.evaluate(() =>
          document.documentElement.scrollWidth - window.innerWidth
        )).toBeLessThanOrEqual(1);
        const slug = path === '/' ? 'startseite' : path.slice(1);
        await page.screenshot({
          path: testInfo.outputPath(`${screen.name}-${slug}.png`),
          fullPage: true,
        });
      });
    }

    test('navigation and contact form are usable', async ({ page }) => {
      await page.route('https://challenges.cloudflare.com/**', route => route.abort());
      await page.goto('/');
      if (screen.width <= 880) {
        const menu = page.locator('.mobile-menu');
        const summary = menu.locator('summary');
        await expect(summary).toBeVisible();
        await summary.click();
        await expect(menu.locator('a[href="/kontakt"]')).toBeVisible();
        await menu.locator('a[href="/kontakt"]').click();
      } else {
        await page.locator('.desktop-nav a[href="/kontakt"]').click();
      }
      await expect(page).toHaveURL(/\/kontakt\/?$/);
      await expect(page.locator('#contactForm')).toBeVisible();
      await expect(page.locator('#contactForm input[name="name"]')).toBeVisible();
      await expect(page.locator('#contactForm input[name="email"]')).toBeVisible();
      await expect(page.locator('#contactForm textarea[name="message"]')).toBeVisible();
      await expect(page.locator('#submitButton')).toBeVisible();
      const buttonHeight = await page.locator('#submitButton').evaluate(el => el.getBoundingClientRect().height);
      expect(buttonHeight).toBeGreaterThanOrEqual(44);
    });
  });
}
