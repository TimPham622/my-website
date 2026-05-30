import React, { useState } from "react";
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

const movieQuotes = [
  { text: "Just be a rock.", movie: "Everything Everywhere All at Once" },
  { text: "I'm CEO, bitch.", movie: "The Social Network" },
  { text: "You don't get to 500 million friends without making a few enemies.", movie: "The Social Network" },
  { text: "Country roads, take me home.", movie: "Whisper of the Heart" },
  { text: "You and I are alike.", movie: "Whisper of the Heart" },
  { text: "Your name is Mitsuha.", movie: "Your Name" },
  { text: "I wanted to tell you that wherever you are, I'll come find you.", movie: "Your Name" },
  { text: "Are you in or out?", movie: "Ocean's Eleven" },
  { text: "You shook Sinatra's hand.", movie: "Ocean's Eleven" },
  { text: "If memories could be canned, would they also have expiry dates?", movie: "Chungking Express" },
  { text: "We brush past so many other people every day.", movie: "Chungking Express" },
  { text: "WALL-E.", movie: "WALL-E" },
  { text: "Directive?", movie: "WALL-E" },
  { text: "Never ask for the meaning of life.", movie: "Yi Yi" },
  { text: "So far, so good.", movie: "La Haine" },
];

function Main() {
  const [quote] = useState(() => movieQuotes[Math.floor(Math.random() * movieQuotes.length)]);

  return (
    <div className="container hero-container">
      <div className="about-section">
        <div className="hero-slideshow" aria-hidden="true">
          {heroScenes.map((scene) => (
            <img key={scene.label} src={scene.src} alt="" />
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
          <figure className="hero-quote">
            <blockquote>“{quote.text}”</blockquote>
            <figcaption>{quote.movie}</figcaption>
          </figure>

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
