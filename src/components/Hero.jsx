import './Hero.css'

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <p className="hero__tagline">Photography by</p>
        <h1 className="hero__title">LIGHTNGVIS</h1>
        <p className="hero__subtitle">Capturing moments in light and shadow</p>
        <a href="#work" className="btn hero__cta">View Work</a>
      </div>
      <div className="hero__scroll">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}

export default Hero
