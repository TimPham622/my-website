import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import Tim from '../assets/images/tim-pham.png';
import ChungkingExpress from '../assets/images/chungking-express.jpg';
import LaHaine from '../assets/images/la-haine.jpeg';
import WallE from '../assets/images/wall-e.jpg';
import YiYi from '../assets/images/yi-yi.jpg';
import YourName from '../assets/images/your-name-big.jpg';

const heroScenes = [
  { src: ChungkingExpress, label: "Chungking Express" },
  { src: WallE, label: "WALL-E" },
  { src: YiYi, label: "Yi Yi" },
  { src: LaHaine, label: "La Haine" },
  { src: YourName, label: "Your Name" },
];

function Main() {

  return (
    <div className="container hero-container">
      <div className="about-section">
        <div className="hero-carousel" aria-hidden="true">
          {[...heroScenes, ...heroScenes].map((scene, index) => (
            <img key={`${scene.label}-${index}`} src={scene.src} alt="" />
          ))}
        </div>
        <div className="film-grain" aria-hidden="true" />
        <div className="image-wrapper">
          <img src={Tim} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/TimPham622" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/tim-pham-4736101b0/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
          <p className="hero-kicker">Now showing</p>
          <h1>Hello, I'm Tim ☺</h1>
          <p>Just be a rock</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/TimPham622" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/tim-pham-4736101b0/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
