// Components
import Hero from "./_hero";
import Skills from "./_skills";
import About from "./_about";

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
      </section>
    </Fragment>
  );
}

export default Home;
