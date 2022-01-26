// Style
import "./Styles/Footer.scss";

export default function Footer(props) {
  return (
    <footer className="footer">
      <a className="footer-item" href="https://github.com/Monsieur-Nico">
        <ion-icon name="logo-github"></ion-icon>
      </a>
      <a
        className="footer-item"
        href="https://www.linkedin.com/in/monsieur-nico/"
      >
        <ion-icon name="logo-linkedin"></ion-icon>
      </a>
      <a
        className="footer-item"
        href="https://discordapp.com/users/718423239071760384"
      >
        <ion-icon name="logo-discord"></ion-icon>
      </a>
      <a className="footer-item" href="https://twitter.com/monsieur_nico">
        <ion-icon name="logo-twitter"></ion-icon>
      </a>
      <a
        className="footer-item"
        href="https://www.instagram.com/nicolas.alkhoury/"
      >
        <ion-icon name="logo-instagram"></ion-icon>
      </a>
    </footer>
  );
}
