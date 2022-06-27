// Components

// Libraries
import { Fragment } from "react";

function Menu() {
  return (
    <Fragment>
      <section className="dropMenu">
        <button className="dropButton">
          <ion-icon name="menu-outline"></ion-icon>
        </button>
      </section>
    </Fragment>
  );
}

export default Menu;
