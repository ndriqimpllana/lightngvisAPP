import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function Contact() {
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
        <h2>Work together</h2>
        <p>Commissions, prints, editorial. Fastest reply by email.</p>
      </div>

      <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__row">
          <div className="contact__field">
            <label htmlFor="from_name">Name</label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              placeholder="Your name"
              required
            />
          </div>
          <div className="contact__field">
            <label htmlFor="reply_to">Email</label>
            <input
              type="email"
              id="reply_to"
              name="reply_to"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="contact__field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="What do you need photographed, and when?"
            required
          />
        </div>

        <div className="contact__footer">
          <button
            type="submit"
            className="btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send Message'}
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
