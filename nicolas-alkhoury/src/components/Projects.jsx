// Components
import NavBar from "./NabBar";

// Style
import "./Styles/Projects.scss";

export default function Projects(props) {
  return (
    <div className="Projects">
      <NavBar />
      <section className="Project-section">
        <ul>
          <li className="Project-item"></li>
          <li className="Project-item"></li>
          <li className="Project-item"></li>
          <li className="Project-item"></li>
        </ul>
      </section>
    </div>
  );
}
