import React from 'react';
import { useContent } from '../content/ContentProvider';
import '../assets/styles/Project.scss';

function Project() {
  const { content, image } = useContent();
  const { projects } = content;

  return (
    <section className="projects-container" id="projects">
      <div className="projects-heading">
        <p className="section-eyebrow">{projects.eyebrow}</p>
        <h1>{projects.heading}</h1>
        <p>{projects.intro}</p>
      </div>
      <div className="projects-grid">
        {projects.items.map((project, index) => (
          <article className="project" key={`${project.title}-${project.href}`}>
            <a className="project-icon" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
              <img src={image(project.image)} alt={`${project.title} thumbnail`} />
            </a>
            <div className="project-copy">
              <div className="project-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <ul aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <a href={project.href} target="_blank" rel="noreferrer"><h2>{project.title}</h2></a>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Project;
