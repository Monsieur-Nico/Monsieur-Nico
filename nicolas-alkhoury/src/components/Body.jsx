// Components
import Footer from "./Footer";

// Style
import "./Styles/Body.scss";

export default function Body(props) {
  return (
    <>
      <section className="body">
        <div className="body-item">
          <div className="body-images">
            <img
              className="body-pic"
              src="https://i.imgur.com/mwf631W.jpg"
              alt="nicolas"
            ></img>
          </div>
          <p className="about-me">
            Hello! My name is Nicolas Alkhoury. I am a Jr. Full-Stack developer.
            <br />I live in Ottawa, Ontario. Recent graduate of Web Development
            bootcamp and in the process of finding a job.
          </p>
        </div>
        <div className="body-item">
          <p className="about-me">
            I am an understanding, patient person with a desire to know, work
            and communicate with others.
            <br />I have gained a lot of experience not only in development,
            also in life, but still... I want more.
          </p>
          <div className="body-images">
            <img
              className="body-pic"
              src="https://i.imgur.com/FinJevl.jpg"
              alt="nicolas"
            ></img>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
