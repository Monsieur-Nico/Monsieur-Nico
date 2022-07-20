// Components
// Style
import "../Style/Footer/Footer.scss";

// Libraries
import { Fragment } from "react";

export default function Footer() {
  return (
    <Fragment>
      <section className="footer">
        <a href="https://github.com/Monsieur-Nico" className="github">
          <ion-icon name="logo-github"></ion-icon>
        </a>
        <a href="https://twitter.com/monsieur_nico" className="twitter">
          <ion-icon name="logo-twitter"></ion-icon>
        </a>
        <a
          href="https://discordapp.com/users/718423239071760384"
          className="discord"
        >
          <ion-icon name="logo-discord"></ion-icon>
        </a>
        <a
          href="https://stackoverflow.com/users/16713898/nicolas-alkhoury"
          className="stackoverflow"
        >
          <ion-icon name="logo-stackoverflow"></ion-icon>
        </a>
      </section>
    </Fragment>
  );
}
