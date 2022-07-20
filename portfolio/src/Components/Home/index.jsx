// Components
import Hero from "./_hero";
import Resume from "./_resume";
import Education from "./_education";
import Skills from "./_skills";
import About from "./_about";
import Projects from "./_projects";

// Style
import "../Style/Home/Home.scss";

// Libraries
import { Fragment } from "react";

function Home() {
  return (
    <Fragment>
      <section className="mainContainer">
        <Hero />
        <Resume />
        <About />
        <Education />
        <Skills />
        <Projects />
      </section>
    </Fragment>
  );
}

export default Home;
