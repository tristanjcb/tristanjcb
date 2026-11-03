import Image from 'next/image';
import { getSupporters } from '@/lib/supporters/server';
import { supporterCopy } from '@/content/supporters';
export const dynamic = 'force-dynamic';
import { Icon } from '@/components/icons/Icon';
import { copy } from '@/content/copy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { metadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale)
    ? metadata(
        locale,
        '/sponsors',
        ui.sponsors[locale],
        copy.sponsors.talk_about_support_collaboration_and_independent[locale],
      )
    : {};
}
export default async function Sponsors({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [github, coffee] = await Promise.all([getSupporters('github'), getSupporters('coffee')]);
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">INDEPENDENT / OPEN / CURIOUS</p>
        <h1>
          {copy.sponsors.room[locale]}
          <br />
          <span className="serif">{copy.sponsors.for_ideas[locale]}</span>
        </h1>
        <p>{supporterCopy.intro[locale]}</p>
      </div>
      <div className="support-platforms">
        {(
          [
            {
              key: 'github',
              title: 'GitHub Sponsors',
              href: 'https://github.com/sponsors/tristanjcb',
              icon: 'github',
              result: github,
            },
            {
              key: 'coffee',
              title: 'Buy Me a Coffee',
              href: 'https://buymeacoffee.com/tristanjcb',
              icon: 'buymeacoffee',
              result: coffee,
            },
          ] as const
        ).map((platform) => (
          <section
            className="support-platform"
            key={platform.key}
            aria-labelledby={`support-${platform.key}`}
          >
            <Icon name={platform.icon} />
            <h2 id={`support-${platform.key}`}>{platform.title}</h2>
            <p>{supporterCopy[platform.key][locale]}</p>
            {platform.result.status === 'ready' && platform.result.supporters.length > 0 ? (
              <ul className="supporter-list">
                {platform.result.supporters.map((person) => (
                  <li key={person.id}>
                    {person.href ? (
                      <a
                        className="supporter-avatar"
                        href={person.href}
                        rel="external"
                        aria-label={person.name}
                        title={person.name}
                      >
                        {person.avatar ? (
                          <Image src={person.avatar} alt="" width={64} height={64} sizes="64px" />
                        ) : (
                          <span aria-hidden="true">
                            {person.name.slice(0, 1).toLocaleUpperCase(locale)}
                          </span>
                        )}
                      </a>
                    ) : (
                      <span className="supporter-avatar" title={person.name}>
                        <span className="sr-only">{person.name}</span>
                        <span aria-hidden="true">
                          {person.name.slice(0, 1).toLocaleUpperCase(locale)}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="support-status">
                {
                  supporterCopy[platform.result.status === 'ready' ? 'empty' : 'unavailable'][
                    locale
                  ]
                }
              </p>
            )}
            <a className="button" href={platform.href}>
              {supporterCopy.join[locale]}
              <Icon name="chevron-right" />
            </a>
          </section>
        ))}
      </div>
      <p className="support-privacy">{supporterCopy.privacy[locale]}</p>
      <section className="detail-facts">
        <h2>{copy.sponsors.open_the_conversation[locale]}</h2>
        <div className="prose">
          <p>{supporterCopy.collaboration[locale]}</p>
          <Link className="text-link" href={`/${locale}/contact`}>
            {ui.contact[locale]} <Icon name="chevron-right" />
          </Link>
        </div>
      </section>
    </div>
  );
}
