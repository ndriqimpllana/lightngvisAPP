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
  const [vh, setVh] = useState(() => window.innerHeight || 1)
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [loadedIndices, setLoadedIndices] = useState(() => new Set([0]))

  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const updateConnectionMode = () => {
      const slowTypes = ['slow-2g', '2g', '3g']
      const shouldReduceData = Boolean(conn?.saveData) || slowTypes.includes(conn?.effectiveType)
      setIsSlowConnection(shouldReduceData)
    }

    updateConnectionMode()
    conn?.addEventListener?.('change', updateConnectionMode)
    return () => conn?.removeEventListener?.('change', updateConnectionMode)
  }, [])

  useEffect(() => {
    if (isSlowConnection) return undefined
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isSlowConnection])

  useEffect(() => {
    if (isSlowConnection) return
    const queue = [current, (current + 1) % heroImages.length]
    queue.forEach((index) => {
      setLoadedIndices((prev) => {
        if (prev.has(index)) return prev
        const next = new Set(prev)
        next.add(index)
        return next
      })
      const img = new Image()
      img.src = heroImages[index]
    })
  }, [current, isSlowConnection])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setVh(window.innerHeight || 1)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Content fades out in the first 40% of the hero height
  const contentOpacity = Math.max(0, 1 - scrollY / (vh * 0.4))
  const contentY = scrollY * 0.25

  // Overlay fades from 0.45 → 0.08 as you scroll through the full hero
  const overlayOpacity = Math.max(0.08, 0.45 - (scrollY / vh) * 0.5)

  // Scroll indicator fades between 20%–60% of hero
  const scrollIndicatorOpacity = Math.max(0, 1 - (scrollY - vh * 0.1) / (vh * 0.35))
  const activeIndex = isSlowConnection ? 0 : current

  return (
    <section id="hero" className="hero">
      {/* Background slideshow */}
      <div className="hero__slideshow">
        {heroImages.map((src, i) => (
          <div
            key={i}
            className={`hero__slide ${i === activeIndex ? 'hero__slide--active' : ''}`}
            style={
              isSlowConnection
                ? (i === 0 ? { backgroundImage: `url(${heroImages[0]})` } : undefined)
                : (loadedIndices.has(i) ? { backgroundImage: `url(${src})` } : undefined)
            }
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
