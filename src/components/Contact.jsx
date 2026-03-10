import './Contact.css'

function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="section-header">
        <h2>Get in Touch</h2>
        <p>Interested in working together? Let's connect.</p>
      </div>

      <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
        <div className="contact__row">
          <div className="contact__field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" />
          </div>
          <div className="contact__field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="your@email.com" />
          </div>
        </div>
        <div className="contact__field">
          <label htmlFor="message">Message</label>
          <textarea id="message" rows="6" placeholder="Tell me about your project..." />
        </div>
        <button type="submit" className="btn">Send Message</button>
      </form>
    </section>
  )
}

export default Contact
