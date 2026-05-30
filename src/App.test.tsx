import React from 'react';
import { render, screen, within } from '@testing-library/react';
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
