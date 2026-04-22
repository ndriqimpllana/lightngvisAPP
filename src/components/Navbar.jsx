import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import './Navbar.css'

function Navbar() {
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
  const { location: { pathname } } = useRouterState()

  const handleNavClick = () => setMenuOpen(false)

  const handleSectionLink = (sectionId) => {
    setMenuOpen(false)
    if (pathname !== '/') {
      navigate({ to: '/', hash: sectionId })
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }
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
            <li><button className="navbar__section-link" onClick={() => handleSectionLink('work')}>Work</button></li>
            <li><button className="navbar__section-link" onClick={() => handleSectionLink('about')}>About</button></li>
            <li><Link to="/contact" onClick={handleNavClick}>Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
