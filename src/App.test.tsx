import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders portfolio sections', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /music/i })).toBeInTheDocument();
  expect(screen.getByText(/Music is the most treasured part of my life/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /favourite movies/i })).toBeInTheDocument();
});

test('keeps navigation above page content and scrolls nav links to sections', () => {
  const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  const replaceState = jest.spyOn(window.history, 'replaceState');

  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 120,
  });

  render(<App />);

  const navigationShell = document.querySelector('.navigation-shell');
  expect(navigationShell).toBeInTheDocument();

  const projectsSection = document.getElementById('projects');
  expect(projectsSection).toBeInTheDocument();
  jest.spyOn(projectsSection as HTMLElement, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 500,
    top: 500,
    left: 0,
    bottom: 700,
    right: 100,
    width: 100,
    height: 200,
    toJSON: () => ({}),
  });

  const topNavigation = screen.getAllByRole('navigation')[0];
  userEvent.click(within(topNavigation).getByRole('link', { name: 'Projects' }));

  expect(scrollTo).toHaveBeenCalledWith({ top: 542, behavior: 'smooth' });
  expect(replaceState).toHaveBeenCalledWith(null, '', '#projects');
});

test('opens a direct article route with homepage links and a persistent theme', () => {
  window.history.pushState(null, '', '/my-website/blog/example-post/');
  window.localStorage.setItem('tim-website-theme', 'light');
  const embedded = document.createElement('script');
  embedded.id = 'blog-data';
  embedded.type = 'application/json';
  embedded.textContent = JSON.stringify({
    index: { heading: 'Writing', subtitle: '', introductionHtml: '<p>Welcome.</p>', posts: [
      { title: 'Example post', slug: 'example-post', date: '2026-10-11', updated: '2026-10-11',
        summary: 'A summary.', tags: ['Mathematics'], coverUrl: '', coverAlt: '', coverCaption: '', readingMinutes: 2 },
    ] },
    post: { title: 'Example post', slug: 'example-post', date: '2026-10-11', updated: '2026-10-11',
      summary: 'A summary.', tags: ['Mathematics'], coverUrl: '', coverAlt: '', coverCaption: '', readingMinutes: 2,
      html: '<h2 id="proof">Proof</h2><p>A mathematical proof.</p>',
      toc: [{ id: 'proof', title: 'Proof', depth: 2 }] },
  });
  document.body.append(embedded);
  try {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Example post' })).toBeInTheDocument();
    expect(screen.getByText('A mathematical proof.')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Proof' })[0]).toHaveAttribute('href', '#proof');
    const topNavigation = screen.getAllByRole('navigation')[0];
    expect(within(topNavigation).getByRole('link', { name: 'About me' })).toHaveAttribute('href', '/my-website/#about-me');
    expect(within(topNavigation).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/my-website/blog/');
    expect(document.querySelector('.blog-page')).toHaveClass('light-mode');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.querySelector('.blog-page')).toHaveClass('dark-mode');
    expect(window.localStorage.getItem('tim-website-theme')).toBe('dark');
  } finally {
    embedded.remove();
    window.history.pushState(null, '', '/');
    window.localStorage.removeItem('tim-website-theme');
  }
});
