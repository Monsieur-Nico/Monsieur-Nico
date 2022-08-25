// Components
import { Fragment } from "react";
import resume from "../../Assets/Nicolas Alkhoury Resume.pdf";

// Style
import "../Style/Home/_HeroButtons.scss";
// Libraries

export default function Buttons() {
  return (
    <Fragment>
      <section className="heroButtons">
        <section className="buttonItem">
          <a
            href={resume}
            download="Nicolas Alkhoury-Resume"
            className="download-button"
          >
            <ion-icon name="cloud-download-outline"></ion-icon>
          </a>
          <p className="button-description">Download Resume</p>
        </section>
        <section className="buttonItem">
          <p className="passive-button">
            <ion-icon name="location"></ion-icon>
          </p>
          <p className="button-description">Ottawa, Ontario</p>
        </section>
        <section className="buttonItem">
          <a
            href="mailto: nicolaskhoury98@gmail.com"
            className="download-button"
          >
            <ion-icon name="mail-outline"></ion-icon>{" "}
          </a>
          <p className="button-description">Email me!</p>
        </section>
      </section>
    </Fragment>
  );
}
