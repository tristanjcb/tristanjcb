import { NarrativeCode } from '@/components/cinematic/NarrativeCode';
import { Icon } from '@/components/icons/Icon';
import { copy } from '@/content/copy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { projects } from '@/content/projects';
import { CinematicJourney, UniverseControls } from '@/components/cinematic/CinematicJourney';
import { ProjectCard } from '@/components/ProjectCard';
import { getArticles } from '@/lib/articles';
import { metadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...metadata(
      locale,
      '',
      'Tristan Jacob / Portfolio',
      copy.page.aurora_tristan_s_world_of_development[locale],
    ),
    title: { absolute: 'Tristan Jacob / Portfolio' },
  };
}
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = await getArticles(locale);
  return (
    <>
      <CinematicJourney locale={locale} highlightedCode={<NarrativeCode />}>
        <section className="container hero" data-universe="origin" id="origin">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              Loading...
            </p>
            <h1>
              Three worlds.
              <br />
              <span className="serif">One origin.</span>
            </h1>
            <p className="hero-description">
              {copy.page.code_taking_shape_sound_telling_stories[locale]}
            </p>
            <Link className="button" href={`/${locale}/projects`}>
              {ui.projects[locale]}{' '}
              <span>
                <Icon name="chevron-right" />
              </span>
            </Link>
          </div>
          <div aria-hidden="true" />
          <UniverseControls locale={locale} />
          <div className="hero-baseline">
            <span>EXPLORING THE SPACE BETWEEN DISCIPLINES</span>
            <a href="#development">
              {copy.page.scroll_to_explore[locale]} <Icon name="down" />
            </a>
          </div>
        </section>
        <section
          className="container universe development"
          id="development"
          data-universe="development"
        >
          <div className="section-marker">
            <span>01 / DEVELOPMENT</span>
            <span className="tiny-cross">+</span>
          </div>
          <div className="universe-layout">
            <div>
              <p className="eyebrow">{copy.page.logic_meets_intuition[locale]}</p>
              <h2>
                {copy.page.build[locale]}
                <br />
                <span className="muted">{copy.page.understand[locale]}</span>
                <br />
                {copy.page.begin_again[locale]}
              </h2>
            </div>
            <div className="universe-aside">
              <span className="code-symbol" aria-hidden="true">
                &lt;/&gt;
              </span>
              <p>{copy.page.i_explore_development_through_web_applications[locale]}</p>
              <Link className="text-link" href={`/${locale}/projects/dev`}>
                {ui.dev[locale]} <Icon name="chevron-right" />
              </Link>
              <p className="mono muted">TypeScript / Node.js / Python</p>
            </div>
          </div>
        </section>
        <section className="music-band">
          <div className="container universe music" id="music" data-universe="music">
            <div className="section-marker">
              <span>02 / MUSIC</span>
              <span>VYKEV</span>
            </div>
            <div className="universe-layout">
              <div className="sound-art" aria-hidden="true">
                {Array.from({ length: 39 }, (_, i) => (
                  <i key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.61)) * 75}%` }} />
                ))}
                <span>NO SOUND. JUST A FEELING.</span>
              </div>
              <div>
                <p className="eyebrow">{copy.page.another_way_to_express[locale]}</p>
                <h2>
                  {copy.page.beyond[locale]}
                  <br />
                  <span className="serif">{copy.page.words[locale]}</span>
                </h2>
                <p>{copy.page.under_the_name_vykev_music_opens[locale]}</p>
                <Link className="text-link" href={`/${locale}/projects/music`}>
                  {copy.page.enter_the_world_of_vykev[locale]} <Icon name="chevron-right" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="container universe creator" id="creator" data-universe="creator">
          <div className="section-marker">
            <span>03 / CONTENT CREATION</span>
            <span>{ui.soon[locale]}</span>
          </div>
          <div className="universe-layout">
            <div>
              <p className="eyebrow">{copy.page.giving_ideas_a_shape[locale]}</p>
              <h2>
                {copy.page.the_next[locale]}
                <br />
                <span className="serif">{copy.page.playground[locale]}</span>
              </h2>
            </div>
            <div className="universe-aside">
              <p>{copy.page.sharing_the_process_the_detours_and[locale]}</p>
              <Link className="text-link" href={`/${locale}/projects/creator`}>
                {ui.creator[locale]} / {ui.soon[locale]} <Icon name="chevron-right" />
              </Link>
            </div>
          </div>
        </section>
        <section className="container section" data-universe="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECTED / 001/005</p>
              <h2>{copy.page.selected_fragments[locale]}</h2>
            </div>
            <Link className="text-link" href={`/${locale}/projects`}>
              {ui.all[locale]} <Icon name="chevron-right" />
            </Link>
          </div>
          <ProjectCard project={projects[0]} locale={locale} featured />
          <div className="project-grid">
            <ProjectCard project={projects[1]} locale={locale} />
            <ProjectCard project={projects[2]} locale={locale} />
          </div>
        </section>
      </CinematicJourney>
      <section className="container section behind">
        <div className="portrait-type" aria-hidden="true">
          <span>TJ</span>
          <small>
            THE PERSON
            <br />
            BEHIND THE PIXELS.
          </small>
        </div>
        <div>
          <p className="eyebrow">BEHIND THE SCREEN</p>
          <h2>
            {copy.page.tristan[locale]}
            <br />
            <span className="serif">{copy.page.simply[locale]}</span>
          </h2>
          <p>{copy.page.self_taught_based_in_france_i[locale]}</p>
          <Link className="text-link" href={`/${locale}/me`}>
            {copy.page.behind_the_screen[locale]} <Icon name="chevron-right" />
          </Link>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NOTES / THOUGHTS / PROCESS</p>
            <h2>
              Journal<span className="accent">.</span>
            </h2>
          </div>
          <Link className="text-link" href={`/${locale}/blog`}>
            {ui.blog[locale]} <Icon name="chevron-right" />
          </Link>
        </div>
        {articles.length ? (
          <div className="article-grid">
            {articles.slice(0, 3).map((article) => (
              <article key={article.slug}>
                <p className="eyebrow">{article.date}</p>
                <h3>
                  <Link href={`/${locale}/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p>{article.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              ✳
            </span>
            <div>
              <h3>{ui.empty[locale]}</h3>
              <p>{ui.emptyBody[locale]}</p>
            </div>
            <span className="mono">
              {ui.soon[locale]} <Icon name="chevron-right" />
            </span>
          </div>
        )}
      </section>
    </>
  );
}
