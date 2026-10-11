import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useContent } from '../content/ContentProvider';
import '../assets/styles/Footer.scss'

function Footer() {
  const { footer } = useContent().content;
  return (
    <footer>
      <div>
        <p>{footer.text}</p>
        <a href={footer.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
        <a href={footer.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
      </div>
    </footer>
  );
}

export default Footer;
