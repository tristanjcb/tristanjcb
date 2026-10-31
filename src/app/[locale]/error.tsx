'use client';
import { copy } from '@/content/copy';
import { useParams } from 'next/navigation';
import {} from '@/lib/i18n';
export default function ErrorPage({ reset }: { reset: () => void }) {
  const { locale } = useParams();
  const lang = locale === 'en' ? 'en' : 'fr';
  return (
    <div className="container page-intro">
      <p className="eyebrow">TRISTAN / ERROR</p>
      <h1>{copy.error.an_interruption[lang]}</h1>
      <p>{copy.error.the_page_could_not_be_loaded[lang]}</p>
      <button className="button" style={{ marginTop: 30 }} onClick={reset}>
        {copy.error.try_again[lang]}
      </button>
    </div>
  );
}
