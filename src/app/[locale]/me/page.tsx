import { copy } from '@/content/copy';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { metadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale)
    ? metadata(
        locale,
        '/me',
        ui.me[locale],
        copy.me.tristan_jacob_development_music_and_creation[locale],
      )
    : {};
}
export default async function Me({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">BEHIND THE SCREEN / TRISTAN JACOB</p>
        <h1>
          {copy.me.always[locale]}
          <br />
          <span className="serif">{copy.me.exploring[locale]}</span>
        </h1>
        <p>{copy.me.three_disciplines_the_same_curiosity_aurora[locale]}</p>
      </div>
      <div className="behind">
        <div className="portrait-type" aria-hidden="true">
          <span>TJ</span>
          <small>
            CODE / SOUND / STORIES
            <br />
            FRANCE
          </small>
        </div>
        <div className="prose">
          <h2>{copy.me.from_a_first_script[locale]}</h2>
          <p>{copy.me.i_m_tristan_jacob_a_self[locale]}</p>
          <h2>{copy.me.to_more_ways_of_expressing[locale]}</h2>
          <p>{copy.me.development_is_a_starting_point_not[locale]}</p>
        </div>
      </div>
      <section className="detail-facts" style={{ marginTop: 80 }}>
        <h2>{copy.me.learning_by_building[locale]}</h2>
        <div className="prose">
          <p>{copy.me.i_work_with_typescript_node_js[locale]}</p>
          <div className="timeline">
            <div>
              <p className="eyebrow">2025 — 2028</p>
              <h3>{copy.me.professional_baccalaur_at_melec[locale]}</h3>
              <p>Saint-Joseph La Salle · {copy.me.electrical_and_connected_systems[locale]}</p>
            </div>
            <div>
              <p className="eyebrow">2022 — 2025</p>
              <h3>{copy.me.national_diploma_of_the_brevet[locale]}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
