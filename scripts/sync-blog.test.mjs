import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const exec = promisify(execFile);
const script = fileURLToPath(new URL('./sync-blog.mjs', import.meta.url));

async function sitemapEntries(site) {
  const xml = await readFile(path.join(site, 'sitemap.xml'), 'utf8');
  assert.equal(XMLValidator.validate(xml), true);
  const value = new XMLParser().parse(xml).urlset.url;
  return { xml, entries: Array.isArray(value) ? value : [value] };
}

test('generates direct article HTML with metadata and excludes drafts', async () => {
  const root = await mkdtemp('/tmp/tim-blog-site-test-');
  const site = path.join(root, 'site');
  const source = path.join(root, 'source');
  try {
    await mkdir(path.join(source, 'posts'), { recursive: true });
    await mkdir(site);
    await writeFile(path.join(site, 'index.html'), '<!doctype html><html><head><title>Tim Pham</title><meta name="description" content="Portfolio"><link rel="canonical" href="https://timpham622.github.io/my-website/"><meta property="og:url" content="https://timpham622.github.io/my-website/"></head><body><div id="root"></div><script src="/my-website/static/js/main.js"></script></body></html>');
    const summary = {
      title: 'A published post', slug: 'published-post', date: '2026-10-11', updated: '2026-10-11',
      summary: 'An article about mathematics.', tags: ['Mathematics'], coverUrl: '',
      coverAlt: '', coverCaption: '', readingMinutes: 3,
    };
    const index = {
      heading: 'Writing', subtitle: 'Notes and essays', introductionHtml: '<p>Welcome.</p>',
      posts: [summary],
    };
    const post = { ...summary, html: '<h2 id="proof">Proof</h2><p>For every x.</p>',
      toc: [{ id: 'proof', title: 'Proof', depth: 2 }] };
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    await writeFile(path.join(source, 'posts', 'published-post.json'), JSON.stringify(post));
    await writeFile(path.join(source, 'posts', 'draft-secret.json'), JSON.stringify({ ...post, slug: 'draft-secret' }));
    await exec(process.execPath, [script, '--source', source, '--site', site]);

    const indexHtml = await readFile(path.join(site, 'blog', 'index.html'), 'utf8');
    const articleHtml = await readFile(path.join(site, 'blog', 'published-post', 'index.html'), 'utf8');
    assert.match(indexHtml, /<h1>Writing<\/h1>/);
    assert.match(indexHtml, /\/my-website\/blog\/published-post\//);
    assert.match(articleHtml, /<title>A published post \| Tim Pham<\/title>/);
    assert.match(articleHtml, /<meta name="description" content="An article about mathematics\."/);
    assert.match(articleHtml, /<link rel="canonical" href="https:\/\/timpham622\.github\.io\/my-website\/blog\/published-post\/"/);
    assert.match(articleHtml, /<meta property="og:type" content="article"/);
    assert.match(articleHtml, /<h2 id="proof">Proof<\/h2>/);
    assert.match(articleHtml, /<script id="blog-data" type="application\/json">/);
    assert.equal((articleHtml.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((articleHtml.match(/property="og:url"/g) || []).length, 1);
    assert.deepEqual(await readdir(path.join(site, 'blog', 'posts')), ['published-post.json']);
    assert.doesNotMatch(articleHtml + indexHtml, /draft-secret/);

    const { xml, entries } = await sitemapEntries(site);
    assert.deepEqual(entries.map((entry) => entry.loc), [
      'https://timpham622.github.io/my-website/',
      'https://timpham622.github.io/my-website/blog/',
      'https://timpham622.github.io/my-website/blog/published-post/',
    ]);
    assert.equal(String(entries[2].lastmod), '2026-10-11');
    assert.match(articleHtml, new RegExp(`<link rel="canonical" href="${entries[2].loc}"`));
    assert.doesNotMatch(xml, /draft-secret/);

    await exec(process.execPath, [script, '--source', source, '--site', site]);
    assert.equal((await sitemapEntries(site)).xml, xml);

    index.posts = [];
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    await exec(process.execPath, [script, '--source', source, '--site', site]);
    assert.deepEqual((await sitemapEntries(site)).entries.map((entry) => entry.loc), entries.slice(0, 2).map((entry) => entry.loc));
    assert.deepEqual(await readdir(path.join(site, 'blog', 'posts')), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('tracks multiple articles, update dates, title changes, unpublishing and deletion', async () => {
  const root = await mkdtemp('/tmp/tim-blog-sitemap-test-');
  const site = path.join(root, 'site');
  const source = path.join(root, 'source');
  try {
    await mkdir(path.join(source, 'posts'), { recursive: true });
    await mkdir(site);
    await writeFile(path.join(site, 'index.html'), '<html><head><title>Tim Pham</title><meta name="description" content="Portfolio"></head><body><div id="root"></div></body></html>');
    const makePost = (slug, date, updated) => ({
      title: slug, slug, date, updated, summary: 'A summary.', tags: [],
      coverUrl: '', coverAlt: '', coverCaption: '', readingMinutes: 1,
      html: '<p>Article body.</p>', toc: [],
    });
    const first = makePost('first-post', '2026-10-01', '2026-10-04');
    const second = makePost('second-post', '2026-09-01', '');
    const third = makePost('third-post', 'invalid', '2026-02-30');
    const index = { heading: 'Writing', subtitle: '', introductionHtml: '<p>Intro.</p>', posts: [first, second, third] };
    for (const post of [first, second, third]) {
      await writeFile(path.join(source, 'posts', `${post.slug}.json`), JSON.stringify(post));
    }
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    const sync = () => exec(process.execPath, [script, '--source', source, '--site', site]);
    await sync();
    let sitemap = await sitemapEntries(site);
    assert.deepEqual(sitemap.entries.map((entry) => entry.loc), [
      'https://timpham622.github.io/my-website/',
      'https://timpham622.github.io/my-website/blog/',
      'https://timpham622.github.io/my-website/blog/first-post/',
      'https://timpham622.github.io/my-website/blog/second-post/',
      'https://timpham622.github.io/my-website/blog/third-post/',
    ]);
    assert.deepEqual(sitemap.entries.slice(2).map((entry) => entry.lastmod ?? null), ['2026-10-04', '2026-09-01', null]);

    first.title = 'A new title';
    first.updated = '2026-10-11';
    await writeFile(path.join(source, 'posts', 'first-post.json'), JSON.stringify(first));
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    await sync();
    sitemap = await sitemapEntries(site);
    assert.equal(String(sitemap.entries[2].lastmod), '2026-10-11');
    assert.equal(sitemap.entries[2].loc, 'https://timpham622.github.io/my-website/blog/first-post/');
    assert.match(await readFile(path.join(site, 'blog', 'first-post', 'index.html'), 'utf8'), /A new title/);

    index.posts = [first, third];
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    await sync();
    sitemap = await sitemapEntries(site);
    assert.ok(!sitemap.xml.includes('second-post'));
    assert.ok(!(await readdir(path.join(site, 'blog'))).includes('second-post'));

    index.posts = [first];
    await rm(path.join(source, 'posts', 'third-post.json'));
    await writeFile(path.join(source, 'index.json'), JSON.stringify(index));
    await sync();
    assert.ok(!(await sitemapEntries(site)).xml.includes('third-post'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
