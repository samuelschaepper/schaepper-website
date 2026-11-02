import { test, expect } from '@playwright/test';

const publishedPaths = ['/', '/leistungen', '/it-beratung', '/projektmanagement', '/management-assessments', '/interim-management', '/ueber-mich', '/kontakt'];

test('sitemap only includes published canonical pages', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  const sitemap = await response.text();
  for (const path of publishedPaths) {
    const expected = `https://www.schaepper.com${path}`;
    expect(sitemap).toContain(`<loc>${expected}</loc>`);
  }
  expect(sitemap).not.toContain('/expertise');
  expect(sitemap).not.toContain('/einblicke');
});

test('robots.txt references the canonical sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('Sitemap: https://www.schaepper.com/sitemap.xml');
});

for (const path of publishedPaths) {
  test(`SEO metadata and structured data: ${path}`, async ({ page }) => {
    await page.route('https://challenges.cloudflare.com/**', route => route.abort());
    await page.goto(path);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(15);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(50);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://www.schaepper.com${path}`);
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(schema);
    expect(data['@type']).toBe('Organization');
    expect(data.url).toBe('https://www.schaepper.com/');
  });
}
