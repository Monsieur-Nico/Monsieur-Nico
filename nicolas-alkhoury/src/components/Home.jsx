// Style
import "./Styles/Body.scss";

export default function Body(props) {
  return (
    <>
      <section className="body">
        <div className="body-item">
          <p className="about-me">Hello there,</p>
        </div>
        <div className="body-item">
          <p className="about-me">
            My name is Nicolas Alkhoury. I am a Jr. Full-Stack developer from
            Canada 🇨🇦.
            <br />A Recent graduate of Web Development bootcamp and in the
            process of finding a job.
            <br />
            <br />
            An understanding, patient person with a desire to know, work and
            communicate with others.
            <br />I have gained a lot of experience not only in development,
            also in life, but still;
            <br />
            <br />I WANT MORE.
          </p>
        </div>
        <section className="fee">
          <div className="fee-title">
            <h1>Entry Fee</h1>
          </div>
          <div className="fee-description">
            <p className="fee-description-text">
              Please process the entry fee to explore my portfolio.
            </p>
          </div>
        </section>
      </section>
    </>
  );
}
