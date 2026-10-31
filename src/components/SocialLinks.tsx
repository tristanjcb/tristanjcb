import { socials } from '@/content/socials';
import type { Locale } from '@/lib/i18n';
import { Icon } from './icons/Icon';
export function SocialLinks({ locale }: { locale: Locale }) {
  return (
    <div className="social-links">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          rel={social.placeholder ? undefined : 'me'}
          className="social-link"
          title={
            social.placeholder
              ? locale === 'fr'
                ? `${social.label} — profil à venir`
                : `${social.label} — profile coming soon`
              : social.label
          }
        >
          <Icon name={social.icon} />
          <span>{social.label}</span>
        </a>
      ))}
    </div>
  );
}
