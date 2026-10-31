import type { Metadata } from 'next';
import type { Locale } from './i18n';
export const origin = 'https://tristan.kresov.com';
export function metadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${origin}/${locale}${path}`,
      languages: {
        fr: `${origin}/fr${path}`,
        en: `${origin}/en${path}`,
        'x-default': `${origin}/fr${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${origin}/${locale}${path}`,
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      alternateLocale: locale === 'fr' ? 'en_GB' : 'fr_FR',
      siteName: 'Aurora · Tristan',
      type: 'website',
      images: [{ url: `${origin}/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${origin}/${locale}/opengraph-image`],
    },
  };
}
