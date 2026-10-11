import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const exec = promisify(execFile);
const script = fileURLToPath(new URL('./sync-blog.mjs', import.meta.url));

test('generates direct article HTML with metadata and excludes drafts', async () => {
  const root = await mkdtemp('/tmp/tim-blog-site-test-');
  const site = path.join(root, 'site');
  const source = path.join(root, 'source');
  try {
    await mkdir(path.join(source, 'posts'), { recursive: true });
    await mkdir(site);
    await writeFile(path.join(site, 'index.html'), '<!doctype html><html><head><title>Tim Pham</title><meta name="description" content="Portfolio"></head><body><div id="root"></div><script src="/my-website/static/js/main.js"></script></body></html>');
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
    assert.deepEqual(await readdir(path.join(site, 'blog', 'posts')), ['published-post.json']);
    assert.doesNotMatch(articleHtml + indexHtml, /draft-secret/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
