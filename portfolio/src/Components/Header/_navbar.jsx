// Components
import Logo from "../../Assets/Nicolas Alkhoury.svg";

// Style

// Libraries
import { Fragment } from "react";

function Nav() {
  return (
    <section className="navbar">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="logoSection">
          <img src={Logo} alt="logo" className="logo" />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <div className="navbar-icon">
            <ion-icon name="menu-outline"></ion-icon>
          </div>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}

export default Nav;
