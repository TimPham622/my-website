import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import mock04 from '../assets/images/mock04.png';
import mock05 from '../assets/images/mock05.png';
import mock06 from '../assets/images/mock06.png';
import mock07 from '../assets/images/mock07.png';
import mock08 from '../assets/images/mock08.png';
import mock09 from '../assets/images/mock09.png';
import mock10 from '../assets/images/Project1.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <a href="https://github.com/TimPham622/Fourier-Transform" target="_blank" rel="noreferrer"><img src={mock10} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/TimPham622/Fourier-Transform" target="_blank" rel="noreferrer"><h2>Fourier Playground</h2></a>
                <p>A C++ project which utilises one of my favourite concepts in mathematics, the Fourier Transform. This project implements both the Discrete Fourier Transform (DFT) for vector drawing reconstruction and the Fast Fourier Transform (FFT) for real-time audio analysis.</p>
            </div>

            <div className="project">
                <a href="https://github.com/TimPham622/oscars-prediction" target="_blank" rel="noreferrer"><img src={mock08} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/TimPham622/oscars-prediction" target="_blank" rel="noreferrer"><h2>2026 Academy Awards Predictor</h2></a>
                <p>Developed a data science project to accurately predict the outcome of the 2026 Academy Awards using python and pandas, whilst also developing statistical methods such as Monte Carlo Simulations and Devigging.</p>
            </div>
            <div className="project">
                <a href="https://github.com/TimPham622/algothon" target="_blank" rel="noreferrer"><img src={mock07} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/TimPham622/algothon" target="_blank" rel="noreferrer"><h2>Susquehanna Algothon</h2></a>
                <p> Participated to build a sophisticated trading algorithm in Python designed to maximize profits in a simulated trading environment, with the goal to have the most optimal Sharpe ratio..</p>
            </div>

        </div>
    </div>
    );
}

export default Project;