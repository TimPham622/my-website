import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = new Map();
for (let index = 0; index < process.argv.length - 2; index += 2) {
  const key = process.argv[index + 2];
  const value = process.argv[index + 3];
  if (!key?.startsWith('--') || !value || value.startsWith('--')) {
    throw new Error(`Expected --option value, received ${key ?? 'nothing'}`);
  }
  options.set(key, value);
}

const site = path.resolve(options.get('--site') || process.env.BUILD_PATH || path.join(projectRoot, 'build'));
const sourceDirectory = options.get('--source') || process.env.CMS_BLOG_SOURCE;
const source = sourceDirectory ? path.resolve(sourceDirectory) : null;
const cmsBlogUrl = (process.env.CMS_BLOG_URL || 'https://timpham622.github.io/cms/blog').replace(/\/$/, '');
const siteUrl = 'https://timpham622.github.io/my-website';
const blogPath = '/my-website/blog';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function dateLabel(value) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function tagsMarkup(tags) {
  return tags.map((tag) => `<a class="blog-tag" href="${blogPath}/?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`).join(' ');
}

function postHref(slug) {
  return `${blogPath}/${slug}/`;
}

function articleListing(post) {
  return `<article class="blog-listing">
    <h2><a href="${postHref(post.slug)}">${escapeHtml(post.title)}</a></h2>
    <div class="blog-listing-rule"></div>
    <p class="blog-meta"><time datetime="${post.date}">${dateLabel(post.date)}</time><span aria-hidden="true">·</span><span>${post.readingMinutes} min read</span></p>
    <p class="blog-summary">${escapeHtml(post.summary)}</p>
    <div class="blog-tags">${tagsMarkup(post.tags)}</div>
  </article>`;
}

function indexMarkup(index) {
  const tags = [...new Set(index.posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
  return `<main class="blog-main blog-index" id="main-content">
    <div class="blog-column">
      <header class="blog-page-header"><p class="blog-kicker">${escapeHtml(index.subtitle)}</p><h1>${escapeHtml(index.heading)}</h1><hr></header>
      <div class="blog-introduction blog-prose">${index.introductionHtml}</div>
      ${tags.length ? `<nav class="blog-filter" aria-label="Filter posts by tag"><a class="blog-tag" href="${blogPath}/">All writing</a>${tagsMarkup(tags)}</nav>` : ''}
      <section aria-label="Published articles">${index.posts.length ? index.posts.map(articleListing).join('') : '<p class="blog-empty">No articles have been published yet.</p>'}</section>
    </div>
  </main>`;
}

function tocItems(toc) {
  return `<ol>${toc.map((heading) =>
    `<li class="blog-toc-depth-${heading.depth}"><a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.title)}</a></li>`
  ).join('')}</ol>`;
}

function articleMarkup(post, previous, next) {
  const cover = post.coverUrl ? `<figure class="blog-cover"><img src="${escapeHtml(post.coverUrl)}" alt="${escapeHtml(post.coverAlt)}">${post.coverCaption ? `<figcaption>${escapeHtml(post.coverCaption)}</figcaption>` : ''}</figure>` : '';
  return `<main class="blog-main blog-article" id="main-content">
    <div class="blog-article-layout">
      <article class="blog-column">
        <a class="blog-back" href="${blogPath}/">← All writing</a>
        <header class="blog-page-header"><h1>${escapeHtml(post.title)}</h1><hr>
          <div class="blog-meta"><span>Published <time datetime="${post.date}">${dateLabel(post.date)}</time></span><span aria-hidden="true">·</span><span>Updated <time datetime="${post.updated}">${dateLabel(post.updated)}</time></span><span aria-hidden="true">·</span><span>${post.readingMinutes} min read</span></div>
          <div class="blog-tags">${tagsMarkup(post.tags)}</div>
        </header>
        ${cover}${post.toc.length ? `<details class="blog-toc-mobile"><summary>Contents</summary>${tocItems(post.toc)}</details>` : ''}
        <div class="blog-prose">${post.html}</div>
        <nav class="blog-post-navigation" aria-label="Other articles">${previous ? `<a href="${postHref(previous.slug)}"><span>Previous article</span>${escapeHtml(previous.title)}</a>` : ''}${next ? `<a href="${postHref(next.slug)}"><span>Next article</span>${escapeHtml(next.title)}</a>` : ''}</nav>
        <a class="blog-back blog-back-bottom" href="${blogPath}/">← Back to all writing</a>
      </article>
      ${post.toc.length ? `<nav class="blog-toc blog-toc-side" aria-label="On this page"><h2>Contents</h2>${tocItems(post.toc)}</nav>` : ''}
    </div>
  </main>`;
}

function pageHtml(template, { title, description, url, coverUrl, body, article, data }) {
  const escapedTitle = escapeHtml(`${title} | Tim Pham`);
  const escapedDescription = escapeHtml(description);
  const tags = [
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDescription}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta name="twitter:card" content="${coverUrl ? 'summary_large_image' : 'summary'}">`,
    ...(coverUrl ? [`<meta property="og:image" content="${escapeHtml(coverUrl)}">`] : []),
  ];
  const withTitle = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);
  const withDescription = withTitle.replace(/<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapedDescription}">`);
  const withMetadata = withDescription.replace('</head>', `${tags.join('')}\n</head>`);
  if (!withMetadata.includes('<div id="root"></div>')) {
    throw new Error('The website HTML template has no React root');
  }
  const embeddedData = JSON.stringify(data).replace(/</g, '\\u003c');
  return withMetadata
    .replace('<div id="root"></div>', `<div id="root"><div class="blog-page dark-mode">${body}</div></div>`)
    .replace('</body>', `<script id="blog-data" type="application/json">${embeddedData}</script></body>`);
}

async function readJson(relative) {
  if (source) return JSON.parse(await readFile(path.join(source, relative), 'utf8'));
  const response = await fetch(`${cmsBlogUrl}/${relative}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`CMS blog feed returned ${response.status} for ${relative}`);
  return response.json();
}

const index = await readJson('index.json');
if (!Array.isArray(index.posts) || typeof index.heading !== 'string' || typeof index.introductionHtml !== 'string') {
  throw new Error('CMS blog index is invalid');
}
const posts = [];
for (const metadata of index.posts) {
  if (typeof metadata.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    throw new Error(`CMS blog index has an invalid slug: ${metadata.slug}`);
  }
  const post = await readJson(`posts/${metadata.slug}.json`);
  if (post.slug !== metadata.slug || typeof post.html !== 'string' || !Array.isArray(post.toc)) {
    throw new Error(`CMS article is invalid: ${metadata.slug}`);
  }
  posts.push(post);
}

const template = await readFile(path.join(site, 'index.html'), 'utf8');
const blogOutput = path.join(site, 'blog');
await rm(blogOutput, { recursive: true, force: true });
await mkdir(path.join(blogOutput, 'posts'), { recursive: true });
await writeFile(path.join(blogOutput, 'index.json'), `${JSON.stringify(index)}\n`);
await writeFile(path.join(blogOutput, 'index.html'), pageHtml(template, {
  title: index.heading, description: index.posts.length ? index.posts[0].summary : index.subtitle || 'Writing by Tim Pham',
  url: `${siteUrl}/blog/`, body: indexMarkup(index), article: false, data: { index },
}));

for (const [position, post] of posts.entries()) {
  await mkdir(path.join(blogOutput, post.slug), { recursive: true });
  await writeFile(path.join(blogOutput, 'posts', `${post.slug}.json`), `${JSON.stringify(post)}\n`);
  await writeFile(path.join(blogOutput, post.slug, 'index.html'), pageHtml(template, {
    title: post.title, description: post.summary, url: `${siteUrl}/blog/${post.slug}/`,
    coverUrl: post.coverUrl, body: articleMarkup(post, posts[position + 1], posts[position - 1]),
    article: true, data: { index, post },
  }));
}

console.log(`Synced ${posts.length} published blog articles into ${blogOutput}`);
