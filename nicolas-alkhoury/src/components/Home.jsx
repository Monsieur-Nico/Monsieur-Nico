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
          <section className="fee-process">
            <div className="fee-title">
              <h1>Entry Fee</h1>
            </div>
            <div classname="process-info">
              <input
                type="text"
                className="info-firstName"
                name="firstName"
              ></input>
              <input
                type="text"
                className="info-LastName"
                name="lastName"
              ></input>
              <input type="email" className="info-email" name="email"></input>
            </div>
          </section>
          <section className="fee-information">
            <div className="info-text">
              <span>Please pay entry fee with an</span>
              <span
                style={{
                  color: "#c89a3c",
                  fontWeight: "bolder",
                  fontSize: "27px",
                }}
              >
                {" "}
                advice{" "}
              </span>
              <span>to expolore my portfolio.</span>
            </div>
          </section>
        </section>
      </section>
    </>
  );
}
