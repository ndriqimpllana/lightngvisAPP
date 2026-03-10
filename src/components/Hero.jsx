import { useState, useEffect } from 'react'
import './Hero.css'

import img1 from '../assets/img/ANDY4354.jpg'
import img2 from '../assets/img/ANDY1168.jpg'
import img3 from '../assets/img/ANDY4279.jpg'
import img4 from '../assets/img/ANDY2067.jpg'
import img5 from '../assets/img/6W0A2737.jpg'
import img6 from '../assets/img/ANDY1105.jpg'
import img7 from '../assets/img/6W0A6103.jpg'
import img8 from '../assets/img/1O4A7889.jpg'
import img9 from '../assets/img/1O4A8100.jpg'
import img10 from '../assets/img/ANDY8813-2.jpg'
import img11 from '../assets/img/1O4A5122.jpg'
import img12 from '../assets/img/1O4A4132.jpg'
import img13 from '../assets/img/1O4A3840.jpg'

const heroImages = [
  img1, img2, img3, img4, img5, img6, img7,
  img8, img9, img10, img11, img12, img13,
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
