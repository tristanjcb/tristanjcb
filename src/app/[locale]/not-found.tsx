'use client';
import { copy } from '@/content/copy';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
export default function NotFound() {
  const params = useParams();
  const value = typeof params.locale === 'string' ? params.locale : 'fr';
  const locale = isLocale(value) ? value : 'fr';
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">404 / LOST IN THE AURORA</p>
        <h1>
          {copy.not_found.off_the[locale]}
          <br />
          <span className="serif">{copy.not_found.beaten_path[locale]}</span>
        </h1>
        <p>{copy.not_found.this_page_does_not_exist_the[locale]}</p>
        <Link className="button" style={{ marginTop: 30 }} href={`/${locale}`}>
          {copy.not_found.back_to_the_origin[locale]} ↗
        </Link>
      </div>
    </div>
  );
}
