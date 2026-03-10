import './About.css'

function About() {
  return (
    <section id="about" className="about section">
      <div className="about__inner">
        <div className="about__image">
          <div className="about__placeholder" />
        </div>
        <div className="about__text">
          <h2>About</h2>
          <p>
            I'm a photographer driven by a fascination with light, shadow,
            and the quiet moments in between. My work explores the beauty
            of everyday life through a minimalist lens.
          </p>
          <p>
            Whether capturing portraits, street scenes, or landscapes,
            I aim to create images that feel both timeless and intimate.
          </p>
          <div className="about__details">
            <div>
              <span className="about__label">Based in</span>
              <span className="about__value">Your City</span>
            </div>
            <div>
              <span className="about__label">Available for</span>
              <span className="about__value">Freelance & Commissions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
