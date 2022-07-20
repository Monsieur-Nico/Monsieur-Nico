// Components
import interview from "../../Assets/Projects/Interview.svg";
import textConvert from "../../Assets/Projects/textConvert.svg";
import devsden from "../../Assets/Projects/devsden.svg";
import UberLabs from "../../Assets/Projects/UberLabs.svg";
import RoKCommander from "../../Assets/Projects/RoKCommander.svg";

// Style
import "../Style/Home/_Projects.scss";

// Libraries
import { Fragment } from "react";

export default function Projects() {
  return (
    <Fragment>
      <section className="projects">
        <section className="projects-title-section">
          <ion-icon name="layers-outline"></ion-icon>{" "}
          <h4 className="projects-title">Projects</h4>
        </section>
        <ul className="projects-list">
          <a href="https://github.com/Monsieur-Nico/RoK-Commander">
            <li
              className="projects-item"
              style={{ backgroundImage: `url(${RoKCommander})` }}
            ></li>
          </a>
          <a href="https://github.com/Monsieur-Nico/Interview-Scheduler">
            <li
              className="projects-item"
              style={{ backgroundImage: `url(${interview})` }}
            ></li>
          </a>
          <a href="https://github.com/Monsieur-Nico/textConvert">
            <li
              className="projects-item"
              style={{ backgroundImage: `url(${textConvert})` }}
            ></li>
          </a>
          <a href="https://github.com/Dev-s-Den/Devs-Den">
            <li
              className="projects-item"
              style={{ backgroundImage: `url(${devsden})` }}
            ></li>
          </a>
          <a href="https://github.com/kencruz/uber-labs">
            <li
              className="projects-item"
              style={{ backgroundImage: `url(${UberLabs})` }}
            ></li>
          </a>
        </ul>
      </section>
    </Fragment>
  );
}
