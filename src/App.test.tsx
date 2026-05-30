import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio sections', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /music/i })).toBeInTheDocument();
  expect(screen.getByText(/Music is the most treasured part of my life/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /favourite movies/i })).toBeInTheDocument();
});
