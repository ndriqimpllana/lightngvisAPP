import heroImg from '../assets/img/ANDY4354.jpg'
import './About.css'

function About() {
  return (
    <section id="about" className="about section">
      <div className="about__inner">
        <div className="about__image">
          <img src={heroImg} alt="" aria-hidden="true" />
        </div>
        <div className="about__text">
          <h2>About, <em>briefly</em></h2>
          {/* TODO: confirm with Ndriçim */}
          <p>Street photography from New York, 2022 onward. I shoot on a Canon R6 with a 35mm prime — one lens, one focal length, because it forces me to move.</p>
          <p>Available for editorial, commissions, and print sales.</p>
          <div className="about__details">
            <div>
              <span className="about__label">Based in</span>
              <span className="about__value">New York City</span>
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
