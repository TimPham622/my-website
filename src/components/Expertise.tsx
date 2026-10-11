import React from 'react';
import { useContent } from '../content/ContentProvider';
import '../assets/styles/Expertise.scss';

function Expertise() {
  const { content, image } = useContent();
  const { about } = content;

  return (
    <div className="container" id="about-me">
      <section className="about-me-container about-spotlight" aria-labelledby="about-heading">
        <div className="about-copy-card">
          <span className="about-kicker">{about.kicker}</span>
          <h1 id="about-heading">{about.heading}</h1>
          <p>{about.body}</p>
        </div>
        <div className="about-photo-collage" aria-label="About me photos">
          {about.photos.map((photo) => (
            <div className="photo-placeholder" key={`${photo.label}-${photo.image}`}>
              {photo.image ? (
                <img className="about-photo" src={image(photo.image)} alt={photo.label} />
              ) : (
                <>
                  <span className="photo-accent" aria-hidden="true">{photo.accent}</span>
                  <span className="photo-icon" aria-hidden="true" />
                </>
              )}
              <span className="photo-label">{photo.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Expertise;
