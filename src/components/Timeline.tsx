import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Timeline.scss'

const lifeEvents = [
  {
    year: "2025",
    title: "Started RSP",
    place: "Adelaide/Remote",
    description: "Participating in a coding bootcamp to enhance my software development skills.",
    icon: faCode,
  },
  {
    year: "2025",
    title: "Computer Science Club Vice President",
    place: "University of Adelaide",
    description: "Elected Vice President to over 700+ paid members whilst in my first year.",
    icon: faUsers,
  },
  {
    year: "2025",
    title: "Started my University Education",
    place: "University of Adelaide",
    description: "Commenced my degree in Mathematics and Computer Science.",
    icon: faGraduationCap,
  },
  {
    year: "2024",
    title: "Graduated Year 12 with a SACE certificate",
    place: "Adelaide High School",
    description: "99.20 ATAR, Merit in Research Project and A+ in Specialist Mathematics, and Mathematical Methods.",
    icon: faBriefcase,
  },
];

function Timeline() {
  return (
    <section id="history" className="life-section">
      <div className="items-container life-panel">
        <div className="life-copy">
          <p className="section-eyebrow">My life / compressed cut</p>
          <h1>About my Life!</h1>
          <p className="life-intro">
            A compact timeline of the moments that shaped what I am building, learning, and leading right now.
          </p>
        </div>

        <div className="life-layout" aria-label="Life milestones timeline">
          <div className="life-collage" aria-hidden="true">
            <div className="collage-card collage-card-large">
              <span>Adelaide</span>
            </div>
            <div className="collage-card collage-card-small collage-card-top">
              <span>Code</span>
            </div>
            <div className="collage-card collage-card-small collage-card-bottom">
              <span>Maths</span>
            </div>
          </div>

          <div className="compact-timeline">
            {lifeEvents.map((event, index) => (
              <article className="life-event" key={`${event.year}-${event.title}`}>
                <div className="event-marker">
                  <span className="event-year">{event.year}</span>
                  <span className="event-dot">
                    <FontAwesomeIcon icon={event.icon} />
                  </span>
                </div>
                <div className="event-card">
                  <span className="event-index">0{index + 1}</span>
                  <h2>{event.title}</h2>
                  <h3>{event.place}</h3>
                  <p>{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
