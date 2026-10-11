const xmlCharacters = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => xmlCharacters[character]);
}

export function validSitemapDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? value : null;
}

export function sitemapXml({ homepageUrl, blogUrl, articles }) {
  const seen = new Set();
  const entries = [];

  function add(url, lastmod) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || seen.has(url)) {
      if (parsed.protocol !== 'https:') throw new Error(`Sitemap URL must use HTTPS: ${url}`);
      return;
    }
    seen.add(url);
    entries.push(`  <url>\n    <loc>${escapeXml(url)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}\n  </url>`);
  }

  add(homepageUrl);
  add(blogUrl);
  for (const article of articles) {
    add(article.url, validSitemapDate(article.updated) || validSitemapDate(article.date));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
