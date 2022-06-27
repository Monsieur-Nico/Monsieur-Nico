// Components
import Hero from "./_hero";

// Style
import "../Style/Home.scss";

// Libraries
import { Fragment } from "react";

function Home() {
  return (
    <Fragment>
      <section className="mainContainer">
        <Hero />
      </section>
    </Fragment>
  );
}

export default Home;
