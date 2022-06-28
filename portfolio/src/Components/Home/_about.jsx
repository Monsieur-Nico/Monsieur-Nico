// Components
// Style
import "../Style/Home/_About.scss";

// Libraries
import { Fragment } from "react";

export default function About() {
  return (
    <Fragment>
      <section className="about">
        <div className="about-title-section">
          <ion-icon name="information-circle-outline"></ion-icon>{" "}
          <h4 className="about-title">About</h4>
        </div>
        <section className="about-bio-section">
          <p className="about-bio">Hello there,</p>
          <p className="about-bio">
            My name is Nicolas Alkhoury,
            <br />I am originally from Syria and reside in Canada. I speak both
            English and Arabic fluently and have experience in a variety of
            platforms, languages, applications, and frameworks, including:
            JavaScript, Node JS, React, Express JS, Git Workflow, SQL, Ruby, and
            CSS.
          </p>
        </section>
      </section>
    </Fragment>
  );
}
