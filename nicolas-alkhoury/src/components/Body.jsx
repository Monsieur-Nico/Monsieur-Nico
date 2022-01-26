// Style
import "./Styles/Body.scss";

export default function Body(props) {
  return (
    <>
      <section className="body">
        <div className="body-images">
          <img
            className="body-pic"
            src="https://i.imgur.com/mwf631W.jpg"
            alt="nicolas"
          ></img>
        </div>
        <p className="about-me">
          Hello! My name is Nicolas Alkhoury. I am a full-stack developer.
          <br />I live in Ottawa, Ontario. I am working remotely on some
          projects.
        </p>
      </section>
    </>
  );
}
