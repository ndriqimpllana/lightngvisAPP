import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Gallery.css'

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

const photos = [
  { id: 1, src: img1, title: 'Untitled I', category: 'Street' },
  { id: 2, src: img2, title: 'Untitled II', category: 'Street' },
  { id: 3, src: img3, title: 'Untitled III', category: 'Street' },
  { id: 4, src: img4, title: 'Untitled IV', category: 'Street' },
  { id: 5, src: img5, title: 'Untitled V', category: 'Street' },
  { id: 6, src: img6, title: 'Untitled VI', category: 'Street' },
  { id: 7, src: img7, title: 'Untitled VII', category: 'Street' },
  { id: 8, src: img8, title: 'Untitled VIII', category: 'Street' },
  { id: 9, src: img9, title: 'Untitled IX', category: 'Street' },
  { id: 10, src: img10, title: 'Untitled X', category: 'Street' },
  { id: 11, src: img11, title: 'Untitled XI', category: 'Street' },
  { id: 12, src: img12, title: 'Untitled XII', category: 'Street' },
  { id: 13, src: img13, title: 'Untitled XIII', category: 'Street' },
]

function Gallery() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(null)

  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setActiveIndex((i) => (i + 1) % photos.length)
  const close = () => setActiveIndex(null)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex])

  const current = activeIndex !== null ? photos[activeIndex] : null

  return (
    <section id="work" className="gallery section">
      <div className="section-header">
        <h2>{t('gallery.heading')}</h2>
        <p>{t('gallery.subheading')}</p>
      </div>

      <div className="gallery__grid">
        {photos.map((item, index) => (
          <div
            key={item.id}
            className="gallery__item"
            onClick={() => setActiveIndex(index)}
          >
            <img
              className="gallery__img"
              src={item.src}
              alt={item.title}
              loading="lazy"
            />
            <div className="gallery__overlay">
              <h3>{item.title}</h3>
              <span>{item.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox__close" onClick={close}>&times;</button>

          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prev() }}>
            &#8592;
          </button>

          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              className="lightbox__img"
              src={current.src}
              alt={current.title}
            />
            <div className="lightbox__info">
              <h3>{current.title}</h3>
              <span>{current.category}</span>
            </div>
          </div>

          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); next() }}>
            &#8594;
          </button>
        </div>
      )}
    </section>
  )
}

export default Gallery
