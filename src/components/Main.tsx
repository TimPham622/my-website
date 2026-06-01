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
import PastLives from '../assets/images/past-lives.jpeg';
import Ponyo from '../assets/images/ponyo.jpeg';

const heroScenes = [
  { src: ChungkingExpress, label: "Chungking Express" },
  { src: WallE, label: "WALL-E" },
  { src: YiYi, label: "Yi Yi" },
  { src: LaHaine, label: "La Haine" },
  { src: YourName, label: "Your Name" },
  { src: PastLives, label: "Past Lives"},
  { src: Ponyo, label: "Ponyo"},
];

const movieQuotes = [
  { text: "Just be a rock.", movie: "Everything Everywhere All at Once" },
  { text: "You don't get to 500 million friends without making a few enemies.", movie: "The Social Network" },
  { text: "I wanted to tell you that wherever you are, I'll come find you.", movie: "Your Name" },
  { text: "If memories ever come in a can, I hope that can never expires.", movie: "Chungking Express" },
  { text: "We brush past so many other people every day.", movie: "Chungking Express" },
  { text: "Love is a matter of timing.", movie: "In the Mood for Love" },
  { text: "Never ask for the meaning of life.", movie: "Yi Yi" },
  { text: "So far, so good.", movie: "La Haine" },
  { text: "Not everyone can become a great artist, but a great artist can come from anywhere.", movie: "Ratatouille" },
];

const songLyrics = [
  { text: "You better start walking; Love takes miles", song: "Love Takes Miles", artist: "Cameron Winter" },
  { text: "Control yourself. Take only what you need from it.", song: "Kids", artist: "MGMT" },
  { text: "To call for hands of above to lean on, wouldn't be good enough for me? No.", song: "Heartbeats", artist: "The Knife" },
  { text: "Love is watching someone die.", song: "What Sarah Said", artist: "Death Cab for Cutie" },
  { text: "Wait. They don't love you like I love you.", song: "Maps", artist: "Yeah Yeah Yeahs" },
  { text: "If I could see all my friends tonight.", song: "All My Friends", artist: "LCD Soundsystem" },
  { text: "I hate you for what you did. And I miss you like a little kid.", song: "Motion Sickness", artist: "Phoebe Bridgers" },
  { text: "And I know it doesn't last, but I don't mind at all anymore", song: "Musician", artist: "Porter Robinson" },
  { text: "Don't you realize our bodies could fall apart any second?", song: "Bodys", artist: "Car Seat Headrest" },

];

function Main() {
  const [quote] = useState(() => {
    const useMovies = Math.random() < 0.5;
    if (useMovies) {
      const item = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
      return { text: item.text, attribution: item.movie };
    } else {
      const item = songLyrics[Math.floor(Math.random() * songLyrics.length)];
      return { text: item.text, attribution: `${item.song} — ${item.artist}` };
    }
  });

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
            <figcaption>{quote.attribution}</figcaption>
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
