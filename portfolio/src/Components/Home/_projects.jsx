// Components
import interview from "../../Assets/Projects/Interview.png";

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
          <li
            className="projects-item"
            style={{
              backgroundImage: `url(${interview})`,
            }}
          >
            <section className="item-footer">
              <section className="footer-info">
                <h6 className="footer-title">Interview Scheduler</h6>
                <p className="footer-bio">
                  A project I completed during my experience at Lighthouse Labs
                  to allow applicants to book an interview appointment with
                  recruiters.
                </p>
              </section>
            </section>
          </li>
          <li className="projects-item"></li>
          <li className="projects-item"></li>
        </ul>
      </section>
    </Fragment>
  );
}
