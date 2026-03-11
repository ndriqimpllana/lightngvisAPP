import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './Shop.css'

import img1  from '../assets/img/ANDY4354.jpg'
import img2  from '../assets/img/ANDY1168.jpg'
import img3  from '../assets/img/ANDY4279.jpg'
import img4  from '../assets/img/ANDY2067.jpg'
import img5  from '../assets/img/6W0A2737.jpg'
import img6  from '../assets/img/ANDY1105.jpg'
import img7  from '../assets/img/6W0A6103.jpg'
import img8  from '../assets/img/1O4A7889.jpg'
import img9  from '../assets/img/1O4A8100.jpg'
import img10 from '../assets/img/ANDY8813-2.jpg'
import img11 from '../assets/img/1O4A5122.jpg'
import img12 from '../assets/img/1O4A4132.jpg'
import img13 from '../assets/img/1O4A3840.jpg'

/* ─── Product catalog ─────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1,  src: img1,  title: 'Untitled I',    category: 'Street', edition: 10 },
  { id: 2,  src: img2,  title: 'Untitled II',   category: 'Street', edition: 10 },
  { id: 3,  src: img3,  title: 'Untitled III',  category: 'Street', edition: 10 },
  { id: 4,  src: img4,  title: 'Untitled IV',   category: 'Street', edition: 15 },
  { id: 5,  src: img5,  title: 'Untitled V',    category: 'Street', edition: 10 },
  { id: 6,  src: img6,  title: 'Untitled VI',   category: 'Street', edition: 10 },
  { id: 7,  src: img7,  title: 'Untitled VII',  category: 'Street', edition: 15 },
  { id: 8,  src: img8,  title: 'Untitled VIII', category: 'Street', edition: 10 },
  { id: 9,  src: img9,  title: 'Untitled IX',   category: 'Street', edition: 10 },
  { id: 10, src: img10, title: 'Untitled X',    category: 'Street', edition: 10 },
  { id: 11, src: img11, title: 'Untitled XI',   category: 'Street', edition: 15 },
  { id: 12, src: img12, title: 'Untitled XII',  category: 'Street', edition: 10 },
  { id: 13, src: img13, title: 'Untitled XIII', category: 'Street', edition: 10 },
]

/* ─── Print sizes ─────────────────────────────────────────────── */
const PRINT_SIZES = [
  { id: '8x10',  label: '8 × 10"',  basePrice: 38  },
  { id: '11x14', label: '11 × 14"', basePrice: 58  },
  { id: '16x20', label: '16 × 20"', basePrice: 88  },
  { id: '20x24', label: '20 × 24"', basePrice: 128 },
  { id: '24x30', label: '24 × 30"', basePrice: 168 },
  { id: '30x40', label: '30 × 40"', basePrice: 240 },
]

/* ─── Materials ───────────────────────────────────────────────── */
const MATERIALS = [
  { id: 'fine-art', label: 'Fine Paper',   description: 'Archival 310gsm matte · museum-quality', mult: 1.0  },
  { id: 'luster',   label: 'Luster Paper', description: 'Satin smooth finish · minimal glare',     mult: 1.15 },
  { id: 'canvas',   label: 'Canvas',       description: 'Stretched gallery-wrap · 1.5″ deep',      mult: 1.65 },
]

/* ─── Frames ──────────────────────────────────────────────────── */
const FRAMES = [
  { id: 'none',              label: 'No Frame',      priceAdd: 0,  thick: 0,  swatchDashed: true },
  { id: 'classic-black',     label: 'Classic Black', priceAdd: 45, thick: 22, swatch: '#1c1c1c',
    bg: 'linear-gradient(145deg,#2c2c2c 0%,#101010 35%,#2a2a2a 65%,#080808 100%)',
    inset: 'inset 0 0 0 2px rgba(255,255,255,0.07),inset 0 0 0 4px rgba(0,0,0,0.55)' },
  { id: 'classic-white',     label: 'Classic White', priceAdd: 45, thick: 22, swatch: '#f2f2f2', swatchBorder: '#d0d0d0',
    bg: 'linear-gradient(145deg,#ffffff 0%,#e8e8e8 35%,#f8f8f8 65%,#dcdcdc 100%)',
    inset: 'inset 0 0 0 2px rgba(0,0,0,0.07),inset 0 0 0 4px rgba(0,0,0,0.03)' },
  { id: 'thin-black',        label: 'Thin Black',    priceAdd: 35, thick: 8,  swatch: '#1c1c1c',
    bg: 'linear-gradient(145deg,#2c2c2c 0%,#101010 35%,#2a2a2a 65%,#080808 100%)',
    inset: 'inset 0 0 0 1px rgba(255,255,255,0.07)' },
  { id: 'thin-white',        label: 'Thin White',    priceAdd: 35, thick: 8,  swatch: '#f2f2f2', swatchBorder: '#d0d0d0',
    bg: 'linear-gradient(145deg,#ffffff 0%,#e8e8e8 35%,#f8f8f8 65%,#dcdcdc 100%)',
    inset: 'inset 0 0 0 1px rgba(0,0,0,0.07)' },
  { id: 'wood',              label: 'Wood',           priceAdd: 65, thick: 20, swatch: '#b8875a',
    bg: ['repeating-linear-gradient(91deg,transparent 0px,transparent 4px,rgba(0,0,0,0.04) 4px,rgba(0,0,0,0.04) 5px,transparent 5px,transparent 11px,rgba(255,255,255,0.06) 11px,rgba(255,255,255,0.06) 12px)',
         'linear-gradient(140deg,#d4a87a 0%,#a06838 18%,#e0b48a 36%,#986030 54%,#cc9a70 72%,#a27040 90%,#b88860 100%)'].join(', '),
    inset: 'inset 0 0 0 1.5px rgba(255,255,255,0.18)' },
  { id: 'thin-silver',       label: 'Thin Silver',   priceAdd: 55, thick: 8,  swatch: '#b8bcc4',
    bg: 'linear-gradient(145deg,#eceef4 0%,#8890a8 12%,#d8dce8 24%,#6878a0 36%,#c8ccd8 50%,#8090b0 62%,#d0d4e0 76%,#9098b8 88%,#e0e4ee 100%)',
    inset: 'inset 0 0 0 1px rgba(255,255,255,0.7)' },
  { id: 'dark-walnut-classic', label: 'Walnut Classic', priceAdd: 75, thick: 22, swatch: '#3d2b1f',
    bg: ['repeating-linear-gradient(90deg,transparent 0px,transparent 5px,rgba(0,0,0,0.06) 5px,rgba(0,0,0,0.06) 6px,transparent 6px,transparent 14px)',
         'linear-gradient(140deg,#4e3528 0%,#2a1810 28%,#5a3e2a 54%,#241408 78%,#3e2818 100%)'].join(', '),
    inset: 'inset 0 0 0 1.5px rgba(255,255,255,0.06)' },
  { id: 'dark-walnut-thin',  label: 'Walnut Thin',   priceAdd: 65, thick: 10, swatch: '#3d2b1f',
    bg: ['repeating-linear-gradient(90deg,transparent 0px,transparent 5px,rgba(0,0,0,0.06) 5px,rgba(0,0,0,0.06) 6px,transparent 6px,transparent 14px)',
         'linear-gradient(140deg,#4e3528 0%,#2a1810 28%,#5a3e2a 54%,#241408 78%,#3e2818 100%)'].join(', '),
    inset: 'inset 0 0 0 1px rgba(255,255,255,0.06)' },
]

/* ─── Mat boards ──────────────────────────────────────────────── */
const MATS = [
  { id: 'none',  label: 'No Mat', priceAdd: 0,  color: null,      dashed: true },
  { id: 'white', label: 'White',  priceAdd: 20, color: '#f7f7f7', border: '#ddd' },
  { id: 'cream', label: 'Cream',  priceAdd: 20, color: '#f3ede0', border: '#d8cdb4' },
  { id: 'black', label: 'Black',  priceAdd: 20, color: '#181818' },
  { id: 'gray',  label: 'Gray',   priceAdd: 20, color: '#8a8a8a' },
]

/* ─── Size map for room preview ───────────────────────────────── */
const SIZE_MAP = {
  '8x10': 100, '11x14': 145, '16x20': 198,
  '20x24': 234, '24x30': 275, '30x40': 330,
}

/* ─── Frame Preview (in customizer) ──────────────────────────── */
function FramePreview({ photo, size, frame, mat }) {
  const [naturalRatio, setNaturalRatio] = useState(null)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setNaturalRatio(img.naturalWidth / img.naturalHeight)
    img.src = photo.src
  }, [photo.src])

  const maxDim = SIZE_MAP[size.id] || 180
  const imageRatio = naturalRatio || (2 / 3)
  let PHOTO_W, PHOTO_H
  if (imageRatio >= 1) { PHOTO_W = maxDim; PHOTO_H = Math.round(maxDim / imageRatio) }
  else                  { PHOTO_H = maxDim; PHOTO_W = Math.round(maxDim * imageRatio) }

  const outerShadow = '0 40px 120px rgba(0,0,0,0.65),0 16px 48px rgba(0,0,0,0.35),2px 4px 0 rgba(255,255,255,0.04)'
  const frameStyle = frame.id !== 'none'
    ? { padding: `${frame.thick}px`, background: frame.bg,
        boxShadow: frame.inset ? `${frame.inset},${outerShadow}` : outerShadow, transition: 'all 0.35s ease' }
    : { boxShadow: outerShadow, transition: 'all 0.35s ease' }
  const matStyle = mat.id !== 'none' ? { padding: '20px', background: mat.color, transition: 'all 0.35s ease' } : {}

  const photoEl = (
    <img src={photo.src} alt={photo.title}
      style={{ display: 'block', width: `${PHOTO_W}px`, height: `${PHOTO_H}px`,
               objectFit: 'cover', transition: 'width 0.35s ease,height 0.35s ease' }} />
  )

  const frameThick = frame.thick || 0
  const matExtra   = mat.id !== 'none' ? 40 : 0
  const shadowW    = PHOTO_W + (frameThick + matExtra / 2) * 2 + 20

  const caption = [
    frame.id !== 'none' && frame.label,
    mat.id   !== 'none' && mat.label,
    size.label,
  ].filter(Boolean).join(' · ')

  return (
    <div className="fp-scene">
      <div className="fp-nail" />
      <div className="fp-artwork" style={frameStyle}>
        {mat.id !== 'none' ? <div style={matStyle}>{photoEl}</div> : photoEl}
      </div>
      <div className="fp-floor-shadow" style={{ width: `${shadowW}px` }} />
      <p className="fp-caption">{caption}</p>
    </div>
  )
}

/* ─── Customizer Modal (full: frame + mat + size + paper) ─────── */
function CustomizerModal({ product, onClose, onAddToCart }) {
  const { t } = useTranslation()
  const [size,     setSize    ] = useState(PRINT_SIZES[1])
  const [material, setMaterial] = useState(MATERIALS[0])
  const [frame,    setFrame   ] = useState(FRAMES[1])
  const [mat,      setMat     ] = useState(MATS[1])

  const price = Math.round(size.basePrice * material.mult + frame.priceAdd + mat.priceAdd)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="cm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cm-modal" role="dialog" aria-modal="true">

        <button className="cm-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="cm-layout">
          {/* LEFT: room preview */}
          <div className="cm-preview-pane">
            <FramePreview photo={product} size={size} frame={frame} mat={mat} />
          </div>

          {/* RIGHT: options */}
          <div className="cm-options-pane">
            <div className="cm-header">
              <h2 className="cm-title">{product.title}</h2>
              <span className="cm-meta">{product.category} Photography</span>
              <span className="cm-edition">{t('shop.limitedEdition')} {product.edition}</span>
            </div>

            <div className="cm-divider" />

            {/* Size */}
            <div className="opt-group">
              <div className="opt-label">{t('shop.size')}</div>
              <div className="opt-pills">
                {PRINT_SIZES.map(s => (
                  <button key={s.id}
                    className={`opt-pill ${size.id === s.id ? 'opt-pill--on' : ''}`}
                    onClick={() => setSize(s)}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="opt-group">
              <div className="opt-label">{t('shop.material')}</div>
              <div className="mat-list">
                {MATERIALS.map(m => (
                  <button key={m.id}
                    className={`mat-item ${material.id === m.id ? 'mat-item--on' : ''}`}
                    onClick={() => setMaterial(m)}>
                    <span className="mat-item__name">{m.label}</span>
                    <span className="mat-item__desc">{m.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame */}
            <div className="opt-group">
              <div className="opt-label">{t('shop.frame')}</div>
              <div className="sw-grid">
                {FRAMES.map(f => (
                  <button key={f.id}
                    className={`sw-btn ${frame.id === f.id ? 'sw-btn--on' : ''}`}
                    onClick={() => setFrame(f)} title={f.label}>
                    <span className="sw-dot"
                      style={f.swatchDashed
                        ? { background: 'transparent', border: '2px dashed #bbb' }
                        : { background: f.bg || f.swatch, border: f.swatchBorder ? `1px solid ${f.swatchBorder}` : 'none' }}
                    />
                    <span className="sw-name">{f.label}</span>
                    <span className="sw-price-tag">
                      {f.priceAdd > 0 ? `+$${f.priceAdd}` : 'Free'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mat */}
            <div className="opt-group">
              <div className="opt-label">{t('shop.mat')}</div>
              <div className="mat-swatches">
                {MATS.map(m => (
                  <button key={m.id}
                    className={`msw-btn ${mat.id === m.id ? 'msw-btn--on' : ''}`}
                    onClick={() => setMat(m)} title={m.label}>
                    <span className="msw-dot"
                      style={m.dashed
                        ? { background: 'transparent', border: '2px dashed #bbb' }
                        : { background: m.color, border: m.border ? `1px solid ${m.border}` : 'none' }}
                    />
                    <span className="msw-name">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="cm-cta">
              <div className="cm-price-row">
                <span className="cm-price-label">{t('shop.total')}</span>
                <span className="cm-price-amount">${price}</span>
              </div>
              <button className="btn cm-add-btn" onClick={() => {
                onAddToCart({ title: product.title, src: product.src,
                  size: size.label, material: material.label,
                  frame: frame.label, mat: mat.label, price })
              }}>
                {t('shop.addToCart')}
              </button>
              <p className="cm-note">{t('shop.note')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Product Card ─────────────────────────────────────────────── */
function ProductCard({ product, onCustomize }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [size,     setSize    ] = useState(PRINT_SIZES[1])
  const [material, setMaterial] = useState(MATERIALS[0])

  const price = Math.round(size.basePrice * material.mult)

  const handleOrder = () => {
    addItem({
      title:    product.title,
      src:      product.src,
      size:     size.label,
      material: material.label,
      frame:    'No Frame',
      mat:      'No Mat',
      price,
    })
  }

  return (
    <article className="sc-card">
      {/* Full image — natural orientation */}
      <div className="sc-img-wrap">
        <img src={product.src} alt={product.title} loading="lazy" className="sc-img" />
      </div>

      <div className="sc-body">
        <div className="sc-header">
          <h3 className="sc-title">{product.title}</h3>
          <span className="sc-edition">{t('shop.limitedEdition')} {product.edition}</span>
        </div>

        {/* Size selection */}
        <div className="sc-opt-group">
          <p className="sc-opt-label">{t('shop.size')}</p>
          <div className="sc-pills">
            {PRINT_SIZES.map(s => (
              <button key={s.id}
                className={`sc-pill ${size.id === s.id ? 'sc-pill--on' : ''}`}
                onClick={() => setSize(s)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paper type */}
        <div className="sc-opt-group">
          <p className="sc-opt-label">{t('shop.material')}</p>
          <div className="sc-pills">
            {MATERIALS.map(m => (
              <button key={m.id}
                className={`sc-pill ${material.id === m.id ? 'sc-pill--on' : ''}`}
                onClick={() => setMaterial(m)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price + Order */}
        <div className="sc-footer">
          <span className="sc-price">${price}</span>
          <button className="btn sc-order-btn" onClick={handleOrder}>
            Order
          </button>
        </div>

        {/* Customize link */}
        <button className="sc-customize-link" onClick={() => onCustomize(product)}>
          Customize &amp; Add Frame →
        </button>
      </div>
    </article>
  )
}

/* ─── Main Shop Section ───────────────────────────────────────── */
function Shop() {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [selected, setSelected] = useState(null)

  const handleAddToCart = (item) => {
    addItem(item)
    setSelected(null)
  }

  return (
    <section id="shop" className="shop section">
      <div className="section-header">
        <h2>{t('shop.heading')}</h2>
        <p>{t('shop.subheading')}</p>
      </div>

      <div className="shop__props">
        <span>✦ {t('shop.prop1')}</span>
        <span>✦ {t('shop.prop2')}</span>
        <span>✦ {t('shop.prop3')}</span>
      </div>

      <div className="shop__grid">
        {PRODUCTS.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onCustomize={setSelected}
          />
        ))}
      </div>

      {selected && (
        <CustomizerModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </section>
  )
}

export default Shop
