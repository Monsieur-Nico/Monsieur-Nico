// Style
import "./Styles/NavBar.scss";

export default function NavBar(props) {
  return (
    <nav className="navbar">
      <div className="nav-item">
        <ion-icon name="home-outline"></ion-icon>
      </div>
      <div className="nav-item">
        <ion-icon name="code-slash-outline"></ion-icon>
      </div>
      <div className="nav-item">
        <ion-icon name="school-outline"></ion-icon>
      </div>
      <div className="nav-item">
        <ion-icon name="briefcase-outline"></ion-icon>
      </div>
      <div className="nav-item">
        <ion-icon name="share-social-outline"></ion-icon>
      </div>
    </nav>
  );
}
