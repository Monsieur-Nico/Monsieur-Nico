// Components
import Hero from "./_hero";
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
        <About />
        <Skills />
        <Projects />
      </section>
    </Fragment>
  );
}

export default Home;
