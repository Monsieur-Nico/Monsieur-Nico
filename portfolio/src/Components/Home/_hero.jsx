// Components
import pfp from "./pfp.jpeg";

// Style

// Libraries
import { Fragment } from "react";

function Hero() {
  return (
    <Fragment>
      <section className="heroSection">
        <div className="heroPFP">
          <img
            src={pfp}
            alt="pfp"
            width="150px"
            height="150px"
            className="heroPicture"
          />
        </div>
      </section>
    </Fragment>
  );
}

export default Hero;
