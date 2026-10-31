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
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">INDEPENDENT / OPEN / CURIOUS</p>
        <h1>
          {copy.sponsors.room[locale]}
          <br />
          <span className="serif">{copy.sponsors.for_ideas[locale]}</span>
        </h1>
        <p>{copy.sponsors.a_space_for_people_and_organizations[locale]}</p>
      </div>
      <section className="detail-facts">
        <h2>{copy.sponsors.open_the_conversation[locale]}</h2>
        <div className="prose">
          <p>{copy.sponsors.no_partnerships_are_announced_here_at[locale]}</p>
          <Link className="text-link" href={`/${locale}/contact`}>
            {ui.contact[locale]} ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
