import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import Music from '../components/Music';
import Movies from '../components/movies';
import { ContentProvider } from './ContentProvider';
import initialContent from './fallback.json';

test('CMS changes control Last.fm requests and the TMDB shelf', async () => {
  const previousFetch = global.fetch;
  const previousLastFmKey = process.env.REACT_APP_LASTFM_API_KEY;
  const previousTmdbKey = process.env.REACT_APP_TMDB_API_KEY;
  process.env.REACT_APP_LASTFM_API_KEY = 'test-lastfm-key';
  process.env.REACT_APP_TMDB_API_KEY = 'test-tmdb-key';

  const editedContent = {
    ...initialContent,
    music: {
      ...initialContent.music,
      lastFm: { username: 'cms-listener', chartDays: 30, topTracksLimit: 2 },
    },
    movies: {
      ...initialContent.movies,
      tmdbShelf: [
        { tmdbId: 34, title: 'Second fallback', fallbackYear: '2002', spine: '#123456', tilt: 3, offset: 8 },
        { tmdbId: 12, title: 'First fallback', fallbackYear: '2001', spine: '#abcdef', tilt: -2, offset: 4 },
      ],
    },
  };

  const fetchMock = jest.fn((input: string) => {
    const url = new URL(input);
    let data: unknown = {};
    let ok = true;

    if (url.pathname.endsWith('/site.json')) data = editedContent;
    else if (url.searchParams.get('method') === 'user.getrecenttracks') data = { recenttracks: { track: [] } };
    else if (url.searchParams.get('method') === 'user.getweeklytrackchart') {
      data = { weeklytrackchart: { track: [
        { name: 'One', artist: { '#text': 'Artist' }, playcount: '5' },
        { name: 'Two', artist: { '#text': 'Artist' }, playcount: '4' },
        { name: 'Three', artist: { '#text': 'Artist' }, playcount: '3' },
      ] } };
    } else if (url.pathname.includes('/movie/34')) {
      data = { title: 'TMDB Second', release_date: '2002-01-01', poster_path: '/poster.jpg', credits: { crew: [{ job: 'Director', name: 'Director' }] } };
    } else if (url.pathname.includes('/movie/12')) ok = false;

    return Promise.resolve({ ok, json: async () => data });
  });
  global.fetch = fetchMock as unknown as typeof fetch;

  try {
    render(<ContentProvider><Music /><Movies /></ContentProvider>);

    expect(await screen.findByRole('heading', { name: 'Most played in the past 30 days' })).toBeInTheDocument();
    expect(screen.getByText('Top 2')).toBeInTheDocument();
    await waitFor(() => expect(document.querySelectorAll('.top-track-item')).toHaveLength(2));

    const shelf = screen.getByLabelText('TMDB DVD shelf');
    await waitFor(() => {
      const buttons = within(shelf).getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('TMDB Second');
      expect(buttons[1]).toHaveTextContent('First fallback');
    });

    const chartRequest = fetchMock.mock.calls
      .map(([input]) => new URL(input))
      .find((url) => url.searchParams.get('method') === 'user.getweeklytrackchart' && url.searchParams.get('user') === 'cms-listener');
    expect(chartRequest).toBeDefined();
    expect(Number(chartRequest?.searchParams.get('to')) - Number(chartRequest?.searchParams.get('from'))).toBe(30 * 24 * 60 * 60);
    expect(fetchMock.mock.calls.some(([input]) => input.includes('/movie/34?api_key=test-tmdb-key'))).toBe(true);
  } finally {
    global.fetch = previousFetch;
    if (previousLastFmKey === undefined) delete process.env.REACT_APP_LASTFM_API_KEY;
    else process.env.REACT_APP_LASTFM_API_KEY = previousLastFmKey;
    if (previousTmdbKey === undefined) delete process.env.REACT_APP_TMDB_API_KEY;
    else process.env.REACT_APP_TMDB_API_KEY = previousTmdbKey;
  }
});
