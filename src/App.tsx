import React, {useState, useEffect} from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Music,
  Movies,
  Navigation,
  Footer,
} from "./components";
import FadeIn from './components/FadeIn';
import Blog from './components/Blog';
import { ContentProvider } from './content/ContentProvider';
import './index.scss';

function App() {
    const [mode, setMode] = useState<string>(() => {
        try { return window.localStorage.getItem('tim-website-theme') === 'light' ? 'light' : 'dark'; }
        catch { return 'dark'; }
    });
    const siteBase = process.env.PUBLIC_URL || (window.location.pathname.startsWith('/my-website') ? '/my-website' : '');
    const blogPrefix = `${siteBase}/blog`;
    const pathname = window.location.pathname;
    const isBlogPage = pathname === blogPrefix || pathname.startsWith(`${blogPrefix}/`);
    const articleSlug = isBlogPage ? pathname.slice(blogPrefix.length).replace(/^\/+|\/+$/g, '') || null : null;

    const handleModeChange = () => {
        setMode((current) => current === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        try { window.localStorage.setItem('tim-website-theme', mode); }
        catch { /* Storage can be unavailable in private browsing. */ }
    }, [mode]);

    useEffect(() => {
        if (isBlogPage) return;
        let section = window.location.hash.slice(1);
        try { section = decodeURIComponent(section); }
        catch { return; }
        if (section) {
            const timer = window.setTimeout(() => {
                const element = document.getElementById(section);
                if (!element) return;
                const top = element.getBoundingClientRect().top + window.scrollY - 78;
                window.scrollTo({ top });
            }, 50);
            return () => window.clearTimeout(timer);
        }
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, [isBlogPage]);

    return (
    <ContentProvider>
    <div className={`${isBlogPage ? 'blog-page' : 'main-container'} ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange} isBlogPage={isBlogPage}/>
        {isBlogPage ? <Blog slug={articleSlug} /> : <>
            <FadeIn transitionDuration={700}>
                <Main/>
                <Expertise/>
                <Timeline/>
                <Project/>
                <Music/>
                <Movies/>
            </FadeIn>
            <Footer />
        </>}
    </div>
    </ContentProvider>
    );
}

export default App;
