import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { ui, type Locale } from '@/lib/i18n';
import { SocialLinks } from './SocialLinks';
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className={styles.footer}>
      <div className="container signature">
        <p className="eyebrow">THE NEXT CHAPTER / {ui.contact[locale]}</p>
        <div className="signature-row">
          <h2>{ui.cta[locale]}</h2>
          <Link className="round-link" href={`/${locale}/contact`} aria-label={ui.contact[locale]}>
            <Icon name="message" />
          </Link>
        </div>
        <div className="footer-bottom">
          <Link className="wordmark" href={`/${locale}`}>
            Tristan<span className="accent">.</span>
          </Link>
          <p>© {new Intl.DateTimeFormat('en', { year: 'numeric' }).format(Date.now())} Tristan</p>
          <SocialLinks locale={locale} />
        </div>
        <p className="colophon">
          Copyright 2026 © Tristan Jacob<span>BUILT WITH ❤.</span>
        </p>
      </div>
    </footer>
  );
}
