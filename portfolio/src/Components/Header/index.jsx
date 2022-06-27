// Components
import Menu from "./_menu";

// Style
import "../Style/Header.scss";

// Libraries
// import { Fragment } from "react";

function Header() {
  return (
    <section className="Header">
      <div className="logo">
        <p>Nicolas</p>
      </div>
      <Menu />
    </section>
  );
}

export default Header;
