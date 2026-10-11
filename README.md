# My website

The homepage is a React and TypeScript portfolio. [Pages CMS](https://github.com/TimPham622/cms) edits its sections, images, and Markdown blog. The homepage fetches `site.json` on load, with a bundled content snapshot if the CMS feed is temporarily unavailable.

## Setup

Use Node.js 22 or later. Run `npm ci`, then copy `.env.example` to `.env.local` and set `REACT_APP_LASTFM_API_KEY` and `REACT_APP_TMDB_API_KEY` for the live music and movie widgets. Start the development server with `npm start`.

`REACT_APP_CMS_BASE_URL` defaults to `https://timpham622.github.io/cms`. The public Last.fm account and chart settings, TMDB DVD shelf, and other section content are edited in Pages CMS. Browser-side API keys are visible in the built JavaScript; treat them as public client keys and apply provider restrictions where available.

## Blog build and URLs

The blog index is `/my-website/blog/`; each published post has `/my-website/blog/<slug>/`. GitHub Pages serves real `index.html` files for direct visits and refreshes. The CMS build renders Markdown, LaTeX, tables, code, and footnotes into sanitized HTML. This repository's `scripts/sync-blog.mjs` writes the blog pages using the compiled React HTML template, including static article content, title, description, canonical link, and social metadata. React takes over for theme control and tag filtering. The article data and static pages contain only published posts.

The blog uses the same navigation bar as the homepage, with a separate editorial layout. The theme choice is saved in localStorage across pages. Homepage section links from an article return to the corresponding homepage section.

`npm run build` builds the React app and syncs the latest [published CMS blog feed](https://timpham622.github.io/cms/blog/index.json). For a local CMS checkout, set `CMS_BLOG_SOURCE=/absolute/path/to/cms/dist/blog` when running the build. `CMS_BLOG_URL` can override the remote feed URL. The build fails if the feed is unavailable, preventing an incomplete deployment.

The CMS publishing workflow normally updates just the blog files on the deployed website's `gh-pages` branch after every CMS change, without rebuilding the React app. To enable that cross-repository update, configure the `WEBSITE_PUBLISH_TOKEN` secret in the CMS repository as described in its README. Without that token, the CMS feed updates but static website blog pages wait for a manual website deployment or workflow rerun after adding the secret.

## Deploy and test

The website's GitHub Pages source is the `gh-pages` branch. With the existing `.env.local` values in place, run:

```bash
npm ci
npm run build
npm test -- --watch=false
npm run deploy
```

The website build uses `gh-pages` to publish the `build/` directory. The CMS workflow then keeps the article files current. Avoid manually editing generated `build/blog` or `gh-pages/blog` files; the next CMS run regenerates them.
