// Components
import LHL from "../../Assets/Education/Nicolas-Alkhoury-DIPLOMA-January-28_-2022.png";
import Developing from "../../Assets/Education/DevelopingSecureSoftware.png";
import TypeScript from "../../Assets/Education/TypeScript.png";
import ReactCer from "../../Assets/Education/React.png";

// Style
import "../Style/Home/_Education.scss";

// Libraries
import { Fragment } from "react";

export default function Education() {
  return (
    <Fragment>
      <section className="education">
        <section className="education-title-section">
          <ion-icon name="school-outline"></ion-icon>
          <h4 className="education-title">Education</h4>
        </section>
        <Fragment>
          <ul className="education-list">
            <li
              className="education-item"
              style={{ backgroundImage: `url(${LHL})` }}
            ></li>
            <li
              className="education-item"
              style={{ backgroundImage: `url(${Developing})` }}
            ></li>
            <li
              className="education-item"
              style={{ backgroundImage: `url(${TypeScript})` }}
            ></li>
            <li
              className="education-item"
              style={{ backgroundImage: `url(${ReactCer})` }}
            ></li>
          </ul>
        </Fragment>
      </section>
    </Fragment>
  );
}
