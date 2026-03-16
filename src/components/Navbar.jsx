import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      setPastHero(window.scrollY >= window.innerHeight * 0.85)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigate = useNavigate()

  const handleNavClick = () => setMenuOpen(false)

  const handleSectionLink = (sectionId) => {
    setMenuOpen(false)
    if (pathname !== '/') {
      navigate({ to: '/' })
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'instant' })
      }, 50)
    } else {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const { totalCount, setIsOpen: openCart } = useCart()
  const { location: { pathname } } = useRouterState()
  const isHome = pathname === '/'
  const isDark = !isHome || pastHero

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isDark ? 'navbar--dark' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          LIGHTNGVIS
        </Link>

        <div className="navbar__right">
          <button
            className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
            <li><button className="navbar__section-link" onClick={() => handleSectionLink('work')}>{t('nav.work')}</button></li>
            <li><Link to="/shop" onClick={handleNavClick}>{t('nav.shop')}</Link></li>
            <li><button className="navbar__section-link" onClick={() => handleSectionLink('about')}>{t('nav.about')}</button></li>
            <li><Link to="/contact" onClick={handleNavClick}>{t('nav.contact')}</Link></li>
          </ul>

          <button className="navbar__cart" onClick={() => openCart(true)} aria-label="Open cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/>
            </svg>
            {totalCount > 0 && <span className="navbar__cart-badge">{totalCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
