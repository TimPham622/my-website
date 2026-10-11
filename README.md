# My Website

The editable portfolio content lives in the separate [CMS repository](https://github.com/TimPham622/cms). Pages CMS publishes its images and `site.json` to GitHub Pages. This React app fetches that content when the page loads, so editing content does not require rebuilding this repository. If the content site is unavailable, the app uses its bundled initial snapshot.

## Setup

1. Install Node.js and npm.
2. Install project dependencies:

    ```bash
    npm install
    ```

3. Create a local environment file for the Last.fm and TMDB live widgets:

    ```bash
    cp .env.example .env.local
    ```

    Then set these variables in `.env.local`:

    ```bash
    REACT_APP_LASTFM_API_KEY=your-lastfm-api-key
    REACT_APP_TMDB_API_KEY=your-tmdb-api-key
    ```

   `REACT_APP_CMS_BASE_URL` defaults to `https://timpham622.github.io/cms`. Set it to another URL to test a different CMS deployment.

   The public Last.fm username, chart period, chart size, and TMDB DVD shelf are edited in Pages CMS. API keys stay in the build environment and are never stored in CMS content. Since this is a browser-only site, build-time API keys are visible to visitors in the compiled JavaScript.

4. Start the development server:

    ```bash
    npm start
    ```

5. Open [http://localhost:3000](http://localhost:3000).

## Deployment

1. Confirm `homepage` in `package.json` matches the GitHub Pages URL for this repo.
2. Build the production app:

    ```bash
    npm run build
    ```

3. Deploy to GitHub Pages:

    ```bash
    npm run deploy
    ```

After this version of the website is deployed once, normal content edits are made through [Pages CMS](https://pagescms.org/) in the `cms` repository. Its workflow updates the content site automatically; this website reads the new content on the next visit.
