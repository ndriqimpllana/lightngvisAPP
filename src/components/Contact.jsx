import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { useTranslation } from 'react-i18next'
import './Contact.css'

// ── EmailJS config ─────────────────────────────────────────────
// Replace these three values after setting up EmailJS (see README below)
const EMAILJS_SERVICE_ID  = 'service_b313sjo'
const EMAILJS_TEMPLATE_ID = 'template_ujsfasx'
const EMAILJS_PUBLIC_KEY  = 'XXTvOyQVNT25dPKFI'

function Contact() {
  const { t } = useTranslation()
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact section">
      <div className="section-header">
        <h2>{t('contact.heading')}</h2>
        <p>{t('contact.subheading')}</p>
      </div>

      <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__row">
          <div className="contact__field">
            <label htmlFor="from_name">{t('contact.name')}</label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              placeholder={t('contact.namePlaceholder')}
              required
            />
          </div>
          <div className="contact__field">
            <label htmlFor="reply_to">{t('contact.email')}</label>
            <input
              type="email"
              id="reply_to"
              name="reply_to"
              placeholder={t('contact.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div className="contact__field">
          <label htmlFor="message">{t('contact.message')}</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder={t('contact.messagePlaceholder')}
            required
          />
        </div>

        <div className="contact__footer">
          <button
            type="submit"
            className="btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : t('contact.send')}
          </button>

          {status === 'success' && (
            <p className="contact__feedback contact__feedback--ok">
              Message sent — I'll be in touch soon.
            </p>
          )}
          {status === 'error' && (
            <p className="contact__feedback contact__feedback--err">
              Something went wrong. Please try again or email directly.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

export default Contact
