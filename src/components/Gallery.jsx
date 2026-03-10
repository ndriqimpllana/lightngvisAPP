import { useState } from 'react'
import './Gallery.css'

const placeholders = [
  { id: 1, title: 'Untitled I', category: 'Portrait', aspect: 'tall' },
  { id: 2, title: 'Untitled II', category: 'Street', aspect: 'wide' },
  { id: 3, title: 'Untitled III', category: 'Landscape', aspect: 'square' },
  { id: 4, title: 'Untitled IV', category: 'Portrait', aspect: 'tall' },
  { id: 5, title: 'Untitled V', category: 'Architecture', aspect: 'wide' },
  { id: 6, title: 'Untitled VI', category: 'Street', aspect: 'square' },
  { id: 7, title: 'Untitled VII', category: 'Landscape', aspect: 'tall' },
  { id: 8, title: 'Untitled VIII', category: 'Portrait', aspect: 'wide' },
  { id: 9, title: 'Untitled IX', category: 'Architecture', aspect: 'square' },
]

function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="work" className="gallery section">
      <div className="section-header">
        <h2>Selected Work</h2>
        <p>A curated collection of moments frozen in time</p>
      </div>

      <div className="gallery__grid">
        {placeholders.map((item) => (
          <div
            key={item.id}
            className={`gallery__item gallery__item--${item.aspect}`}
            onClick={() => setLightbox(item)}
          >
            <div className="gallery__placeholder" />
            <div className="gallery__overlay">
              <h3>{item.title}</h3>
              <span>{item.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}>
            &times;
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__placeholder" />
            <div className="lightbox__info">
              <h3>{lightbox.title}</h3>
              <span>{lightbox.category}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
