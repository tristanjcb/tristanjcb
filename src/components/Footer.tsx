import Link from 'next/link';
import styles from './Footer.module.scss';
import { ui, type Locale } from '@/lib/i18n';
import { email, socials } from '@/content/socials';
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className={styles.footer}>
      <div className="container signature">
        <p className="eyebrow">THE NEXT CHAPTER / {ui.contact[locale]}</p>
        <div className="signature-row">
          <h2>{ui.cta[locale]}</h2>
          <Link className="round-link" href={`/${locale}/contact`} aria-label={ui.contact[locale]}>
            ↗
          </Link>
        </div>
        <div className="footer-bottom">
          <Link className="wordmark" href={`/${locale}`}>
            aurora<span className="accent">.</span>
          </Link>
          <p>
            © {new Intl.DateTimeFormat('en', { year: 'numeric' }).format(Date.now())} Tristan Jacob
          </p>
          <div>
            {socials.slice(0, 2).map((social) => (
              <a key={social.label} href={social.href} rel="me">
                {social.label} ↗
              </a>
            ))}
            <a href={`mailto:${email}`}>Email ↗</a>
          </div>
        </div>
        <p className="colophon">
          CODE · SOUND · STORIES <span>BUILT WITH INTENTION.</span>
        </p>
      </div>
    </footer>
  );
}
