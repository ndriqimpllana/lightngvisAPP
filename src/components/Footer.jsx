import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">LIGHTNGVIS</span>
        <div className="footer__links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
          <a href="mailto:hello@lightngvis.com">Email</a>
        </div>
        <span className="footer__copy">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default Footer
