import { useTranslation } from 'react-i18next'
import './Contact.css'

function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="contact section">
      <div className="section-header">
        <h2>{t('contact.heading')}</h2>
        <p>{t('contact.subheading')}</p>
      </div>

      <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
        <div className="contact__row">
          <div className="contact__field">
            <label htmlFor="name">{t('contact.name')}</label>
            <input type="text" id="name" placeholder={t('contact.namePlaceholder')} />
          </div>
          <div className="contact__field">
            <label htmlFor="email">{t('contact.email')}</label>
            <input type="email" id="email" placeholder={t('contact.emailPlaceholder')} />
          </div>
        </div>
        <div className="contact__field">
          <label htmlFor="message">{t('contact.message')}</label>
          <textarea id="message" rows="6" placeholder={t('contact.messagePlaceholder')} />
        </div>
        <button type="submit" className="btn">{t('contact.send')}</button>
      </form>
    </section>
  )
}

export default Contact
