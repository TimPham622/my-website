import React, { useMemo } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useContent } from '../content/ContentProvider';
import '../assets/styles/Main.scss';

function Main() {
  const { content, image } = useContent();
  const { hero } = content;
  const quote = useMemo(
    () => hero.quotes[Math.floor(Math.random() * hero.quotes.length)],
    [hero.quotes]
  );

  return (
    <div className="container hero-container">
      <div className="about-section">
        <div className="hero-slideshow" aria-hidden="true">
          {hero.slides.map((scene) => (
            <img key={`${scene.label}-${scene.image}`} src={image(scene.image)} alt="" />
          ))}
        </div>
        <div className="film-grain" aria-hidden="true" />
        <div className="image-wrapper">
          <img src={image(hero.portrait)} alt="Portrait of Tim" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href={hero.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
            <a href={hero.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
          <p className="hero-kicker">{hero.kicker}</p>
          <h1>{hero.heading}</h1>
          {quote && (
            <figure className="hero-quote">
              <blockquote>“{quote.text}”</blockquote>
              <figcaption>{quote.attribution}</figcaption>
            </figure>
          )}
          <div className="mobile_social_icons">
            <a href={hero.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
            <a href={hero.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
