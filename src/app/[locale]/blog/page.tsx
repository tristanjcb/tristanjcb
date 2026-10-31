import { copy } from '@/content/copy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { getArticles } from '@/lib/articles';
import { metadata } from '@/lib/seo';
import { JournalIndex } from '@/components/JournalIndex';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale)
    ? metadata(
        locale,
        '/blog',
        ui.blog[locale],
        copy.blog.notes_process_and_discoveries_the_aurora[locale],
      )
    : {};
}
export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = await getArticles(locale);
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">NOTES / THOUGHTS / PROCESS</p>
        <h1>
          Journal<span className="accent">.</span>
        </h1>
        <p>{copy.blog.what_i_learn_what_i_try[locale]}</p>
      </div>
      <JournalIndex
        locale={locale}
        articles={articles.map(({ slug, title, description, tags, date, minutes }) => ({
          slug,
          title,
          description,
          tags,
          date,
          minutes,
        }))}
      />
      <Link className="text-link" style={{ marginTop: 40 }} href="/rss.xml" prefetch={false}>
        RSS ↗
      </Link>
    </div>
  );
}
