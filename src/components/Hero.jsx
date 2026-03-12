import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh = window.innerHeight

  // Content fades out in the first 40% of the hero height
  const contentOpacity = Math.max(0, 1 - scrollY / (vh * 0.4))
  const contentY = scrollY * 0.25

  // Overlay fades from 0.75 → 0.08 as you scroll through the full hero
  const overlayOpacity = Math.max(0.08, 0.75 - (scrollY / vh) * 0.9)

  // Scroll indicator fades between 20%–60% of hero
  const scrollIndicatorOpacity = Math.max(0, 1 - (scrollY - vh * 0.1) / (vh * 0.35))

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

      {/* Overlay fades with scroll to reveal raw photos */}
      <div className="hero__overlay" style={{ opacity: overlayOpacity }} />

      {/* Content fades and rises as you scroll */}
      <div
        className="hero__content"
        style={{
          opacity: contentOpacity,
          transform: `translateY(-${contentY}px)`,
          pointerEvents: contentOpacity < 0.05 ? 'none' : 'auto',
        }}
      >
        <p className="hero__tagline">{t('hero.tagline')}</p>
        <h1 className="hero__title">NDRIÇIM PLLANA</h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
      </div>

      {/* Scroll indicator — lingers after content fades */}
      <div className="hero__scroll" style={{ opacity: scrollIndicatorOpacity }}>
        <span>{t('hero.scroll')}</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}

export default Hero
