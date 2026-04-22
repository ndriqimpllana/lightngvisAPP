import { useState, useEffect, useRef } from 'react'
import { photos } from '../assets/images'
import './Gallery.css'

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const touchStart = useRef(null)

  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setActiveIndex((i) => (i + 1) % photos.length)
  const close = () => setActiveIndex(null)

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev() }
    touchStart.current = null
  }

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

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
        <h2>Selected Work</h2>
        <p>Thirteen frames. Reset quarterly.</p>
      </div>

      <div className="gallery__grid">
        {photos.map((item, index) => (
          <div
            key={item.id}
            className={`gallery__item ${item.span || 's-landscape'}`}
            onClick={() => setActiveIndex(index)}
          >
            <img
              className="gallery__img"
              src={item.src}
              alt={item.title}
              loading="lazy"
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
            <div className="gallery__overlay">
              <h3>{String(index + 1).padStart(2, '0')} · {item.shortTitle || item.title}</h3>
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox__close" onClick={close} aria-label="Close lightbox">
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path d="M4 4l12 12M16 4L4 16"/>
            </svg>
          </button>

          <div className="lightbox__counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous photo">
            &#8592;
          </button>

          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              className="lightbox__img"
              src={current.srcFull || current.src}
              alt={current.title}
              decoding="async"
            />
            <div className="lightbox__info">
              <h3>{current.title}</h3>
              <span>{current.location} · {current.year}</span>
            </div>
          </div>

          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next photo">
            &#8594;
          </button>
        </div>
      )}
    </section>
  )
}

export default Gallery
