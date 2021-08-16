import { Icon } from '../components/atoms/Icon';
import { $ } from '../utils';
import './index.scss';

function loadFooterImages() {
  const footer = $('footer');

  if (footer) {
    // Create icons
    const githubIcon = Icon('github', { onclick: openGithub });
    const emailIcon = Icon('email', { onclick: mailTo });

    footer.appendChild(githubIcon);
    footer.appendChild(emailIcon);
  }
}

function openGithub() {
  window.open(`https://github.com/bramirez96`);
}
function mailTo() {
  const EMAIL = 'brandon@brr.dev';
  const SUBJECT = 'Portfolio Inquiry';
  window.open(`mailto:${EMAIL}?subject=${SUBJECT}`, '_blank');
}

/* Code to load page content */
function pageLoader() {
  loadFooterImages();
}

window.addEventListener('load', pageLoader);
