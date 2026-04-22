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
          <p>Street photography from New York, fell in love with photography in 2018 and have not looked back since. I mostly shoot 
            in Canon 5D Mark IV, the majority of my work had been shot in the Canon Mark IV excpect for my early years when i used to 
            shoot with my first ever camera the Canon 5D Mark III and the fixed lens 100mm, f2.8. As of now i am making the switch to Fujifilm
            with the new camera that i just purchased the X100V.
          </p>
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
