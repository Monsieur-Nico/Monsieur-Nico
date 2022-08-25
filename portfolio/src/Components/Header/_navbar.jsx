// Components
import Logo from "../../Assets/Nicolas Alkhoury.svg";

// Style

// Libraries

function Nav() {
  return (
    <section className="navbar">
      <nav className="navbar">
        <div className="logoSection">
          <img src={Logo} alt="logo" className="logo" />
        </div>
        <section className="email-section">
          <a href="mailto:nicolaskhoury98@gmail.com" className="email-icon">
            <ion-icon name="mail-outline"></ion-icon>
          </a>
          <p className="email-text">nicolaskhoury98@gmail.com</p>
        </section>
      </nav>
    </section>
  );
}

export default Nav;
