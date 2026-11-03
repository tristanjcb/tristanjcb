'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ui, type Locale } from '@/lib/i18n';
type Summary = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  minutes: number;
};
export function JournalIndex({ locale, articles }: { locale: Locale; articles: Summary[] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const tags = [...new Set(articles.flatMap((article) => article.tags))];
  const filtered = articles.filter(
    (article) =>
      (!tag || article.tags.includes(tag)) &&
      `${article.title} ${article.description}`
        .toLocaleLowerCase(locale)
        .includes(query.toLocaleLowerCase(locale)),
  );
  return (
    <>
      {articles.length > 0 && (
        <>
          <label className="journal-search">
            {ui.search[locale]}
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui.searchPlaceholder[locale]}
            />
          </label>
          <div className="filters">
            <button className="filter" aria-pressed={!tag} onClick={() => setTag('')}>
              {ui.all[locale]}
            </button>
            {tags.map((value) => (
              <button
                className="filter"
                key={value}
                aria-pressed={value === tag}
                onClick={() => setTag(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </>
      )}
      {filtered.length ? (
        <div className="article-grid">
          {filtered.map((article) => (
            <article key={article.slug}>
              <p className="eyebrow">
                <time dateTime={article.date}>
                  {new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
                    new Date(article.date),
                  )}
                </time>{' '}
                / {article.minutes} MIN
              </p>
              <h2>
                <Link href={`/${locale}/blog/${article.slug}`}>{article.title}</Link>
              </h2>
              <p>{article.description}</p>
              <p className="mono">{article.tags.join(' / ')}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ✳
          </span>
          <div>
            <h3>{articles.length ? ui.noResults[locale] : ui.empty[locale]}</h3>
            <p>{ui.emptyBody[locale]}</p>
          </div>
        </div>
      )}
    </>
  );
}
