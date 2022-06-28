// Components
import Nav from "./_navbar";

// Style
import "../Style/Header/Header.scss";
import "../Style/Header/HeaderPC.scss";

// Libraries
// import { Fragment } from "react";

function Header() {
  return (
    <section className="Header">
      <Nav />
    </section>
  );
}

export default Header;
