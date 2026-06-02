import React from "react";
import academyAwardsPredictor from '../assets/images/academy-awards-predictor.webp';
import fourierPlayground from '../assets/images/fourier-playground.webp';
import susquehannaAlgothon from '../assets/images/susquehanna-algothon.webp';
import '../assets/styles/Project.scss';

const projects = [
    {
        title: "Fourier Playground",
        href: "https://github.com/TimPham622/Fourier-Transform",
        image: fourierPlayground,
        tags: ["C++", "FFT", "Audio"],
        description: "A C++ project which utilises one of my favourite concepts in mathematics, the Fourier Transform. This project implements both the Discrete Fourier Transform (DFT) for vector drawing reconstruction and the Fast Fourier Transform (FFT) for real-time audio analysis.",
    },
    {
        title: "2026 Academy Awards Predictor",
        href: "https://github.com/TimPham622/oscars-prediction",
        image: academyAwardsPredictor,
        tags: ["Python", "Pandas", "Monte Carlo"],
        description: "Developed a data science project to accurately predict the outcome of the 2026 Academy Awards using python and pandas, whilst also developing statistical methods such as Monte Carlo Simulations and Devigging.",
    },
    {
        title: "Susquehanna Algothon",
        href: "https://github.com/TimPham622/algothon",
        image: susquehannaAlgothon,
        tags: ["Trading", "Python", "Sharpe"],
        description: "Participated to build a sophisticated trading algorithm in Python designed to maximize profits in a simulated trading environment, with the goal to have the most optimal Sharpe ratio.",
    },
];

function Project() {
    return(
    <section className="projects-container" id="projects">
        <div className="projects-heading">
            <p className="section-eyebrow">Selected builds / quick scan</p>
            <h1>Personal Projects</h1>
            <p>Here is a list of some of my favourite personal projects that I have done since the start of Uni. I tried to tackle a different language each time, and prioritised my interests.</p>
        </div>

        <div className="projects-grid">
            {projects.map((project, index) => (
                <article className="project" key={project.title}>
                    <a className="project-icon" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
                        <img src={project.image} alt={`${project.title} thumbnail`} />
                    </a>
                    <div className="project-copy">
                        <div className="project-meta">
                            <span>0{index + 1}</span>
                            <ul aria-label={`${project.title} technologies`}>
                                {project.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
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
