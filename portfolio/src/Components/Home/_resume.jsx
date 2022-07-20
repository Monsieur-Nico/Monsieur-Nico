// Components
import { Fragment } from "react";
import resume from "../../Assets/Nicolas Alkhoury Resume.pdf";

// Style
import "../Style/Home/_Resume.scss";
// Libraries

export default function Resume() {
  return (
    <Fragment>
      <section className="hero-resume">
        <a
          href={resume}
          download="Nicolas Alkhoury-Resume"
          className="download-button"
        >
          <ion-icon name="cloud-download-outline"></ion-icon>
        </a>
        <p className="resume-download">Download Resume</p>
      </section>
    </Fragment>
  );
}
