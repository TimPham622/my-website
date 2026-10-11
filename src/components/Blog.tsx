import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import '../assets/styles/Blog.scss';

type Heading = { id: string; title: string; depth: number };
type PostSummary = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  summary: string;
  tags: string[];
  coverUrl: string;
  coverAlt: string;
  coverCaption: string;
  readingMinutes: number;
};
type Post = PostSummary & { html: string; toc: Heading[] };
type BlogIndex = {
  heading: string;
  subtitle: string;
  introductionHtml: string;
  posts: PostSummary[];
};
type BlogData = { index: BlogIndex; post?: Post };

function siteBase() {
  return process.env.PUBLIC_URL || (window.location.pathname.startsWith('/my-website') ? '/my-website' : '');
}

function readEmbeddedData(slug: string | null): BlogData | null {
  const element = document.getElementById('blog-data');
  if (!element?.textContent) return null;
  try {
    const value = JSON.parse(element.textContent) as BlogData;
    if (!Array.isArray(value.index?.posts) || (slug && value.post?.slug !== slug)) return null;
    return value;
  } catch { return null; }
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function TagLinks({ tags }: { tags: string[] }) {
  return <div className="blog-tags">{tags.map((tag) =>
    <a className="blog-tag" href={`${siteBase()}/blog/?tag=${encodeURIComponent(tag)}`} key={tag}>{tag}</a>
  )}</div>;
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  const links = <ol>{headings.map((heading) =>
    <li className={`blog-toc-depth-${heading.depth}`} key={heading.id}>
      <a href={`#${heading.id}`}>{heading.title}</a>
    </li>
  )}</ol>;
  return <details className="blog-toc-mobile"><summary>Contents</summary>{links}</details>;
}

function BlogIndexPage({ index }: { index: BlogIndex }) {
  const activeTag = new URLSearchParams(window.location.search).get('tag');
  const tags = Array.from(new Set(index.posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b));
  const posts = activeTag ? index.posts.filter((post) => post.tags.includes(activeTag)) : index.posts;

  return <main className="blog-main blog-index" id="main-content">
    <div className="blog-column">
      <header className="blog-page-header">
        {index.subtitle && <p className="blog-kicker">{index.subtitle}</p>}
        <h1>{index.heading}</h1><hr />
      </header>
      <div className="blog-introduction blog-prose" dangerouslySetInnerHTML={{ __html: index.introductionHtml }} />
      {tags.length > 0 && <nav className="blog-filter" aria-label="Filter posts by tag">
        <a className="blog-tag" href={`${siteBase()}/blog/`} aria-current={!activeTag ? 'page' : undefined}>All writing</a>
        {tags.map((tag) => <a className="blog-tag" href={`${siteBase()}/blog/?tag=${encodeURIComponent(tag)}`}
          aria-current={activeTag === tag ? 'page' : undefined} key={tag}>{tag}</a>)}
      </nav>}
      <section aria-label="Published articles">
        {posts.length ? posts.map((post) => <article className="blog-listing" key={post.slug}>
          <h2><a href={`${siteBase()}/blog/${post.slug}/`}>{post.title}</a></h2>
          <div className="blog-listing-rule" />
          <p className="blog-meta"><time dateTime={post.date}>{dateLabel(post.date)}</time><span aria-hidden="true">·</span><span>{post.readingMinutes} min read</span></p>
          <p className="blog-summary">{post.summary}</p>
          <TagLinks tags={post.tags} />
        </article>) : <p className="blog-empty">{activeTag ? `No articles with the tag “${activeTag}”.` : 'No articles have been published yet.'}</p>}
      </section>
    </div>
  </main>;
}

function ArticlePage({ post, index }: { post: Post; index: BlogIndex }) {
  const position = index.posts.findIndex((entry) => entry.slug === post.slug);
  const previous = index.posts[position + 1];
  const next = position > 0 ? index.posts[position - 1] : undefined;
  const backHref = `${siteBase()}/blog/`;

  return <main className="blog-main blog-article" id="main-content">
    <div className="blog-article-layout">
      <article className="blog-column">
        <a className="blog-back" href={backHref}>← All writing</a>
        <header className="blog-page-header">
          <h1>{post.title}</h1><hr />
          <div className="blog-meta">
            <span>Published <time dateTime={post.date}>{dateLabel(post.date)}</time></span>
            <span aria-hidden="true">·</span>
            <span>Updated <time dateTime={post.updated}>{dateLabel(post.updated)}</time></span>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <TagLinks tags={post.tags} />
        </header>
        {post.coverUrl && <figure className="blog-cover">
          <img src={post.coverUrl} alt={post.coverAlt} />
          {post.coverCaption && <figcaption>{post.coverCaption}</figcaption>}
        </figure>}
        <TableOfContents headings={post.toc} />
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <nav className="blog-post-navigation" aria-label="Other articles">
          {previous && <a href={`${siteBase()}/blog/${previous.slug}/`}><span>Previous article</span>{previous.title}</a>}
          {next && <a href={`${siteBase()}/blog/${next.slug}/`}><span>Next article</span>{next.title}</a>}
        </nav>
        <a className="blog-back blog-back-bottom" href={backHref}>← Back to all writing</a>
      </article>
      {post.toc.length > 0 && <nav className="blog-toc blog-toc-side" aria-label="On this page">
        <h2>Contents</h2>
        <ol>{post.toc.map((heading) => <li className={`blog-toc-depth-${heading.depth}`} key={heading.id}>
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>)}</ol>
      </nav>}
    </div>
  </main>;
}

function Blog({ slug }: { slug: string | null }) {
  const [data, setData] = useState<BlogData | null>(() => readEmbeddedData(slug));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) return;
    const controller = new AbortController();
    const base = `${siteBase()}/blog`;
    const readJson = async (url: string) => {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Blog returned ${response.status}`);
      return response.json();
    };
    Promise.all([readJson(`${base}/index.json`), slug ? readJson(`${base}/posts/${slug}.json`) : Promise.resolve(undefined)])
      .then(([index, post]) => setData({ index, post }))
      .catch((fetchError) => { if (fetchError.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, [data, slug]);

  if (error) return <main className="blog-main blog-state" id="main-content"><h1>Article unavailable</h1><p>Please try again later.</p><a href={`${siteBase()}/blog/`}>Back to all writing</a></main>;
  if (!data) return <main className="blog-main blog-state" id="main-content"><p>Loading writing…</p></main>;
  if (slug && !data.post) return <main className="blog-main blog-state" id="main-content"><h1>Article not found</h1><a href={`${siteBase()}/blog/`}>Back to all writing</a></main>;
  return slug ? <ArticlePage post={data.post as Post} index={data.index} /> : <BlogIndexPage index={data.index} />;
}

export default Blog;
