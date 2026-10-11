import assert from 'node:assert/strict';
import test from 'node:test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { escapeXml, sitemapXml, validSitemapDate } from './sitemap-xml.mjs';

const parse = (xml) => {
  assert.equal(XMLValidator.validate(xml), true);
  const entries = new XMLParser().parse(xml).urlset.url;
  return Array.isArray(entries) ? entries : [entries];
};

test('escapes XML characters and rejects malformed calendar dates', () => {
  assert.equal(escapeXml(`&<>"'`), '&amp;&lt;&gt;&quot;&apos;');
  assert.equal(validSitemapDate('2026-02-28'), '2026-02-28');
  for (const value of ['2026-02-30', '2026-13-01', '2026-1-01', 'today', '', undefined]) {
    assert.equal(validSitemapDate(value), null);
  }
});

test('makes valid XML with stable URLs, date fallback, no duplicates, and no invented lastmod', () => {
  const homepageUrl = 'https://example.com/my-website/';
  const blogUrl = `${homepageUrl}blog/`;
  const articles = [
    { url: `${blogUrl}first/?source=a&version=2`, updated: '2026-10-11', date: '2026-10-01' },
    { url: `${blogUrl}second/`, updated: '2026-02-30', date: '2026-02-28' },
    { url: `${blogUrl}third/`, updated: 'invalid', date: undefined },
    { url: `${blogUrl}first/?source=a&version=2`, updated: '2026-10-12', date: '2026-10-01' },
  ];
  const xml = sitemapXml({ homepageUrl, blogUrl, articles });
  const entries = parse(xml);
  assert.match(xml, /first\/\?source=a&amp;version=2/);
  assert.deepEqual(entries.map((entry) => entry.loc), [homepageUrl, blogUrl, ...articles.slice(0, 3).map((entry) => entry.url)]);
  assert.equal(entries[0].lastmod, undefined);
  assert.equal(entries[1].lastmod, undefined);
  assert.equal(String(entries[2].lastmod), '2026-10-11');
  assert.equal(String(entries[3].lastmod), '2026-02-28');
  assert.equal(entries[4].lastmod, undefined);
  assert.equal(sitemapXml({ homepageUrl, blogUrl, articles }), xml);
  assert.deepEqual(parse(sitemapXml({ homepageUrl, blogUrl, articles: [] })).map((entry) => entry.loc), [homepageUrl, blogUrl]);
});
