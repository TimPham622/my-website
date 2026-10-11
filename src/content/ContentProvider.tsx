import React, { createContext, useContext, useEffect, useState } from 'react';
import fallbackContent from './fallback.json';

export type SiteContent = typeof fallbackContent;

type ContentState = {
  content: SiteContent;
  image: (path: string) => string;
};

const cmsBaseUrl = (process.env.REACT_APP_CMS_BASE_URL || 'https://timpham622.github.io/cms').replace(/\/$/, '');
const fallbackBaseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

const ContentContext = createContext<ContentState>({
  content: fallbackContent,
  image: (path) => `${fallbackBaseUrl}${path}`,
});

function hasRequiredSections(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const content = value as Partial<SiteContent>;
  return Boolean(
    Array.isArray(content.hero?.slides) && Array.isArray(content.hero?.quotes) &&
    Array.isArray(content.about?.photos) && Array.isArray(content.timeline?.events) &&
    Array.isArray(content.projects?.items) && Array.isArray(content.music?.favorites) &&
    Array.isArray(content.music?.recommendations) && Array.isArray(content.movies?.favorites) &&
    Array.isArray(content.navigation?.items) && content.footer
  );
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [published, setPublished] = useState({ content: fallbackContent, mediaBaseUrl: fallbackBaseUrl });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${cmsBaseUrl}/site.json`, { signal: controller.signal, cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`CMS returned ${response.status}`);
        return response.json();
      })
      .then((value: unknown) => {
        if (!hasRequiredSections(value)) throw new Error('CMS content is incomplete');
        setPublished({ content: value, mediaBaseUrl: cmsBaseUrl });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.warn('Using bundled portfolio content:', error);
      });
    return () => controller.abort();
  }, []);

  const image = (path: string) => {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
    return path.startsWith('/') ? `${published.mediaBaseUrl}${path}` : path;
  };

  return <ContentContext.Provider value={{ content: published.content, image }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
