import { useState } from 'react'
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
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="work" className="gallery section">
      <div className="section-header">
        <h2>{t('gallery.heading')}</h2>
        <p>{t('gallery.subheading')}</p>
      </div>

      <div className="gallery__grid">
        {photos.map((item) => (
          <div
            key={item.id}
            className="gallery__item"
            onClick={() => setLightbox(item)}
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
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}>
            &times;
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              className="lightbox__img"
              src={lightbox.src}
              alt={lightbox.title}
            />
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
