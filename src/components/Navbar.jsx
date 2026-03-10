import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Navbar.css'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'sq', label: 'SQ' },
  { code: 'es', label: 'ES' },
  { code: 'ar', label: 'AR' },
]

function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo">
          LIGHTNGVIS
        </a>

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
          <li><a href="#work" onClick={handleNavClick}>{t('nav.work')}</a></li>
          <li><a href="#about" onClick={handleNavClick}>{t('nav.about')}</a></li>
          <li><a href="#contact" onClick={handleNavClick}>{t('nav.contact')}</a></li>
          <li className="navbar__lang">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`lang-btn ${i18n.language === lang.code ? 'lang-btn--active' : ''}`}
                onClick={() => { i18n.changeLanguage(lang.code); handleNavClick() }}
              >
                {lang.label}
              </button>
            ))}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
