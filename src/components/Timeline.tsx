import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Timeline.scss'
import { useContent } from '../content/ContentProvider';

const icons = { briefcase: faBriefcase, code: faCode, graduationCap: faGraduationCap, users: faUsers };

function Timeline() {
  const { timeline } = useContent().content;
  return (
    <section id="history" className="life-section">
      <div className="items-container life-panel">
        <div className="life-copy">
          <h1>{timeline.heading}</h1>
          <p className="life-intro">{timeline.intro}</p>
        </div>

        <div className="life-layout" aria-label="Life milestones timeline">
          <div className="life-collage" aria-hidden="true">
            <div className="collage-card collage-card-large">
              <span>{timeline.collage[0]}</span>
            </div>
            <div className="collage-card collage-card-small collage-card-top">
              <span>{timeline.collage[1]}</span>
            </div>
            <div className="collage-card collage-card-small collage-card-bottom">
              <span>{timeline.collage[2]}</span>
            </div>
          </div>

          <div className="compact-timeline">
            {timeline.events.map((event, index) => (
              <article className="life-event" key={`${event.year}-${event.title}`}>
                <div className="event-marker">
                  <span className="event-year">{event.year}</span>
                  <span className="event-dot">
                    <FontAwesomeIcon icon={icons[event.icon as keyof typeof icons] || faBriefcase} />
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
