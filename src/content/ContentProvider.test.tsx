import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentProvider, useContent } from './ContentProvider';
import initialContent from './fallback.json';

function Probe() {
  const { content, image } = useContent();
  return <><h1>{content.hero.heading}</h1><img src={image(content.hero.portrait)} alt="portrait" /></>;
}

test('loads CMS edits and resolves CMS media paths', async () => {
  const previousFetch = global.fetch;
  const editedContent = {
    ...initialContent,
    hero: { ...initialContent.hero, heading: 'Updated in CMS' },
  };
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => editedContent,
  });

  try {
    render(<ContentProvider><Probe /></ContentProvider>);
    expect(await screen.findByRole('heading', { name: 'Updated in CMS' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'portrait' })).toHaveAttribute(
      'src',
      'https://timpham622.github.io/cms/media/images/tim-pham.webp',
    );
  } finally {
    global.fetch = previousFetch;
  }
});
