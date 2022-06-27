// Components
import Menu from "./_menu";
import Logo from "../../Assets/Nicolas Alkhoury.svg";

// Style
import "../Style/Header.scss";

// Libraries
// import { Fragment } from "react";

function Header() {
  return (
    <section className="Header">
      <div className="logoSection">
        <img src={Logo} alt="logo" className="logo" />
      </div>
      <Menu />
    </section>
  );
}

export default Header;
