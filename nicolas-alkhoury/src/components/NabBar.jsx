// Libraries
import { Outlet, Link } from "react-router-dom";

// Style
import "./Styles/NavBar.scss";

export default function NavBar(props) {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="item-link">
          <div className="nav-item">
            <ion-icon name="home-outline"></ion-icon>
          </div>
        </Link>
        <Link to="/Projects" className="item-link">
          <div className="nav-item">
            <ion-icon name="code-slash-outline"></ion-icon>
          </div>
        </Link>
        <Link to="/Education" className="item-link">
          <div className="nav-item">
            <ion-icon name="school-outline"></ion-icon>
          </div>
        </Link>
        <Link to="/Career" className="item-link">
          <div className="nav-item">
            <ion-icon name="briefcase-outline"></ion-icon>
          </div>
        </Link>
        <Link to="/" className="item-link">
          <div className="nav-item">
            <ion-icon name="share-social-outline"></ion-icon>
          </div>
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
