// Components
import JS from "../../Assets/Icons/js.svg";
import TS from "../../Assets/Icons/typescript.svg";
import HTML from "../../Assets/Icons/html.svg";
import ReactIcon from "../../Assets/Icons/react.svg";
import CSS from "../../Assets/Icons/css3.svg";
import GIT from "../../Assets/Icons/git.svg";
import jQuery from "../../Assets/Icons/jquery.svg";
import Markdown from "../../Assets/Icons/markdown.svg";
import MongoDB from "../../Assets/Icons/mongodb.svg";
import NodeJS from "../../Assets/Icons/node-js.svg";
import PostgreSQL from "../../Assets/Icons/postgresql.svg";
import Ruby from "../../Assets/Icons/ruby.svg";

// Style
import "../Style/Home/Skills/Skills.scss";

// Libraries
import { Fragment } from "react";

export default function Skills() {
  return (
    <Fragment>
      <section className="skills">
        <h4 className="skills-title">Skills</h4>
        <ul className="skills-list">
          <li className="skills-item">
            <img className="Markdown" src={Markdown} alt="Markdown" />
          </li>
          <li className="skills-item">
            <img className="HTML" src={HTML} alt="HTML" />
          </li>
          <li className="skills-item">
            <img className="TS" src={TS} alt="TS" />
          </li>
          <li className="skills-item">
            <img className="JS" src={JS} alt="JS" />
          </li>
          <li className="skills-item">
            <img className="CSS" src={CSS} alt="CSS" />
          </li>
          <li className="skills-item">
            <img className="GIT" src={GIT} alt="GIT" />
          </li>
          <li className="skills-item">
            <img className="React" src={ReactIcon} alt="React" />
          </li>
          <li className="skills-item">
            <img className="jQuery" src={jQuery} alt="jQuery" />
          </li>
          <li className="skills-item">
            <img className="MongoDB" src={MongoDB} alt="MongoDB" />
          </li>
          <li className="skills-item">
            <img className="NodeJS" src={NodeJS} alt="NodeJS" />
          </li>
          <li className="skills-item">
            <img className="PostgreSQL" src={PostgreSQL} alt="PostgreSQL" />
          </li>
          <li className="skills-item">
            <img className="Ruby" src={Ruby} alt="Ruby" />
          </li>
        </ul>
      </section>
    </Fragment>
  );
}
