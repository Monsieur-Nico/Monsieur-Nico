// Components
import Header from "./Components/Header";
import Home from "./Components/Home/";

// Style
import "./App.scss";

// Libraries
import { Fragment } from "react";

function App() {
  return (
    <Fragment>
      <Header />
      <Home />
    </Fragment>
  );
}

export default App;
