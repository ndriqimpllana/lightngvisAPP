import { useState, useEffect } from 'react'
import './Hero.css'

/*
  Replace these placeholder paths with your actual images.
  Drop your photos into src/assets/hero/ and update the imports.
*/
const heroImages = [
  null, // placeholder 1
  null, // placeholder 2
  null, // placeholder 3
  null, // placeholder 4
  null, // placeholder 5
  null, // placeholder 6
  null, // placeholder 7
  null, // placeholder 8
  null, // placeholder 9
  null, // placeholder 10
]

function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="hero">
      {/* Background slideshow */}
      <div className="hero__slideshow">
        {heroImages.map((src, i) => (
          <div
            key={i}
            className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
            style={src ? { backgroundImage: `url(${src})` } : undefined}
          />
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__tagline">Photography by</p>
        <h1 className="hero__title">NDRIÇIM PLLANA</h1>
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
