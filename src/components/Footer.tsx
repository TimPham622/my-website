import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <p>Built by Tim with love</p>
        <a href="https://github.com/TimPham622" target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <a href="https://www.linkedin.com/in/tim-pham-4736101b0/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
      </div>
    </footer>
  );
}

export default Footer;