// Components
import Hero from "./_hero";
import Buttons from "./_heroButtons";
import Education from "./_education";
import Skills from "./_skills";
import About from "./_about";
import Projects from "./_projects";
// import Contact from "./_contact";

// Style
import "../Style/Home/Home.scss";

// Libraries
import { Fragment } from "react";

function Home() {
  return (
    <Fragment>
      <section className="mainContainer">
        {/* <Contact /> */}
        <Hero />
        <Buttons />
        <About />
        <Education />
        <Skills />
        <Projects />
      </section>
    </Fragment>
  );
}

export default Home;
