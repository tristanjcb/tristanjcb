export const dynamicParams = false;
import Link from 'next/link';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { isLocale, locales, navigation, ui } from '@/lib/i18n';
import { projects, projectPath } from '@/content/projects';
import { getArticles } from '@/lib/articles';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MotionSystem } from '@/components/cinematic/MotionSystem';
import { ThemeProvider } from '@/components/ThemeProvider';
import { origin } from '@/lib/seo';
import '@/styles/globals.scss';
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: 'Tristan', template: '%s · Tristan' },
};
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = await getArticles(locale);
  const translatedArticles = (await getArticles(locale === 'fr' ? 'en' : 'fr')).map(
    (article) => article.slug,
  );
  const items = [
    ...navigation.map((item) => ({
      label: ui[item.key][locale],
      detail: 'Tristan',
      href: `/${locale}${item.path}`,
    })),
    ...projects.map((project) => ({
      label: project.title,
      detail: project.subtitle[locale],
      href: `/${locale}${projectPath(project)}`,
    })),
    ...articles.map((article) => ({
      label: article.title,
      detail: 'Journal',
      href: `/${locale}/blog/${article.slug}`,
    })),
  ];
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <MotionSystem />
          <a className="skip-link" href="#main">
            {ui.skip[locale]}
          </a>
          <Navigation locale={locale} items={items} translatedArticles={translatedArticles} />
          <noscript>
            <nav className="no-script-nav" aria-label={ui.menu[locale]}>
              {navigation.map((item) => (
                <Link key={item.key} href={`/${locale}${item.path}`}>
                  {ui[item.key][locale]}
                </Link>
              ))}
            </nav>
          </noscript>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
