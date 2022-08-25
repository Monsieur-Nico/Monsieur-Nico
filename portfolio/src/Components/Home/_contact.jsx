// Style
import "../Style/Home/_Contact.scss";

// Components
import { Fragment } from "react";

export default function Contact() {
  return (
    <Fragment>
      <button className="contact">
        <ion-icon name="chatbubbles-outline"></ion-icon>
      </button>
    </Fragment>
  );
}
