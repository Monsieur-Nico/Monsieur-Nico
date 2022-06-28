// Components
import pfp from "../../Assets/pfp.jpeg";

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
        <p className="heroName">Nicolas Alkhoury</p>
        <p className="heroTitle">Full-Stack Developer</p>
      </section>
    </Fragment>
  );
}

export default Hero;
