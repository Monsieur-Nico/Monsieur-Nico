// Components
import Hero from "./_hero";
import Skills from "./_skills";

// Style
import "../Style/Home/Home.scss";

// Libraries
import { Fragment } from "react";

function Home() {
  return (
    <Fragment>
      <section className="mainContainer">
        <Hero />
        <Skills />
      </section>
    </Fragment>
  );
}

export default Home;
