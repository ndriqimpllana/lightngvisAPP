import { useTranslation } from 'react-i18next'
import './About.css'

function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="about section">
      <div className="about__inner">
        <div className="about__image">
          <div className="about__placeholder" />
        </div>
        <div className="about__text">
          <h2>{t('about.heading')}</h2>
          <p>{t('about.bio1')}</p>
          <p>{t('about.bio2')}</p>
          <div className="about__details">
            <div>
              <span className="about__label">{t('about.basedIn')}</span>
              <span className="about__value">{t('about.basedInValue')}</span>
            </div>
            <div>
              <span className="about__label">{t('about.availableFor')}</span>
              <span className="about__value">{t('about.availableForValue')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
