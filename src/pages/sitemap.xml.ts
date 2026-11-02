import data from '../data/website.json';

const origin = 'https://www.schaepper.com';
const published = data.pages.filter(page =>
  page.path === '/' || (page.path !== '/expertise' && !page.path.startsWith('/einblicke'))
);

export function GET() {
  const urls = published.map(page => {
    const loc = origin + (page.path === '/' ? '/' : page.path);
    return `  <url><loc>${loc}</loc></url>`;
  }).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
