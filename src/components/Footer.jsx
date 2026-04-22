import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">Ndriçim Pllana</span>
        <div className="footer__links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
          <a href="mailto:lightngvis@gmail.com">Email</a>
        </div>
        <span className="footer__copy">&copy; {new Date().getFullYear()}</span>
      </div>
      <div className="footer__colophon">Set in Fraunces &amp; Inter. Built in New York.</div>
    </footer>
  )
}

export default Footer
