import React from "react";
import '../assets/styles/Expertise.scss';

const photoPlaceholders = [
    { label: "Weekend wander", accent: "✦" },
    { label: "Study snap", accent: "☼" },
    { label: "Coffee corner", accent: "♡" },
    { label: "Future photo", accent: "✺" },
];

function Expertise() {
    return (
        <div className="container" id="about-me">
            <section className="about-me-container about-spotlight" aria-labelledby="about-heading">
                <div className="about-copy-card">
                    <span className="about-kicker">A little hello</span>
                    <h1 id="about-heading">About Me</h1>
                    <p>
I am a second year Mathematical and Computer Sciences student studying at the University of Adelaide. With a high interest in mathematics, more specifically decision theory, I hope that my future will be directed into a position where I can utilise my passion for mathematics into industry. I also have a high ambition to study postgraduate Medicine, and wish to attain an interdisciplinary background in both computer science and medicine.
                    </p>
                </div>

                <div className="about-photo-collage" aria-label="Photo placeholders for future about me photos">
                    {photoPlaceholders.map((photo) => (
                        <div className="photo-placeholder" key={photo.label}>
                            <span className="photo-accent" aria-hidden="true">{photo.accent}</span>
                            <span className="photo-icon" aria-hidden="true" />
                            <span className="photo-label">{photo.label}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Expertise;
