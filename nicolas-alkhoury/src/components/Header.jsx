// Components
import NavBar from "./NabBar";

// Style
import "./Styles/Header.scss";

export default function Header(props) {
  return (
    <header className="Protfilio-header">
      <h1 className="header-title">Alkhoury, Nicolas</h1>
      <NavBar />
    </header>
  );
}
