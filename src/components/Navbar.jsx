import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Navbar.css'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'sq', label: 'Shqip', short: 'SQ' },
  { code: 'es', label: 'Espa\u00f1ol', short: 'ES' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', short: 'AR' },
]

function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigate = useNavigate()

  const handleNavClick = () => setMenuOpen(false)

  const handleSectionLink = (sectionId) => {
    setMenuOpen(false)
    const scrollToSection = () => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(scrollToSection, 100)
    } else {
      scrollToSection()
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
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

          {/* Language dropdown */}
          <div className="lang-dropdown" ref={langRef}>
            <button
              className="lang-dropdown__trigger"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select language"
            >
              {currentLang.short}
              <svg className={`lang-dropdown__arrow ${langOpen ? 'lang-dropdown__arrow--open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>

            {langOpen && (
              <ul className="lang-dropdown__menu">
                {LANGUAGES.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`lang-dropdown__item ${i18n.language === lang.code ? 'lang-dropdown__item--active' : ''}`}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false) }}
                    >
                      <span className="lang-dropdown__short">{lang.short}</span>
                      <span className="lang-dropdown__label">{lang.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
