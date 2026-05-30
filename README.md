# My Website

## Setup

1. Install Node.js and npm.
2. Install project dependencies:

    ```bash
    npm install
    ```

3. Create a local environment file if you want the Last.fm listening widget to show live data:

    ```bash
    cp .env.example .env.local
    ```

    Then set these variables in `.env.local`:

    ```bash
    REACT_APP_LASTFM_USERNAME=your-lastfm-username
    REACT_APP_LASTFM_API_KEY=your-lastfm-api-key
    ```

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
