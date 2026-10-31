import { Icon } from '@/components/icons/Icon';
export const dynamicParams = false;
import { copy } from '@/content/copy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { isLocale } from '@/lib/i18n';
import { getArticles } from '@/lib/articles';
import { headingId } from '@/lib/article-schema';
import { metadata, origin } from '@/lib/seo';
type Params = { locale: string; slug: string };
export async function generateStaticParams() {
  return (await getArticles()).map((article) => ({ locale: article.locale, slug: article.slug }));
}
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = (await getArticles(locale)).find((article) => article.slug === slug);
  if (!article) return {};
  const result = metadata(locale, `/blog/${slug}`, article.title, article.description);
  const translations = (await getArticles()).filter((item) => item.slug === slug);
  return {
    ...result,
    alternates: {
      canonical: `${origin}/${locale}/blog/${slug}`,
      languages: Object.fromEntries(
        translations.map((item) => [item.locale, `${origin}/${item.locale}/blog/${slug}`]),
      ),
    },
    openGraph: { ...result.openGraph, type: 'article', publishedTime: article.date },
  };
}
export default async function Article({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = (await getArticles(locale)).find((article) => article.slug === slug);
  if (!article) notFound();
  const ids = new Map<string, number>();
  const heading = (props: React.HTMLAttributes<HTMLHeadingElement>, level: 2 | 3) => {
    const flatten = (node: React.ReactNode): string =>
      Array.isArray(node)
        ? node.map(flatten).join('')
        : typeof node === 'string' || typeof node === 'number'
          ? String(node)
          : node && typeof node === 'object' && 'props' in node
            ? flatten((node as React.ReactElement<{ children?: React.ReactNode }>).props.children)
            : '';
    const base = headingId(flatten(props.children));
    const count = ids.get(base) ?? 0;
    ids.set(base, count + 1);
    const id = count ? `${base}-${count}` : base;
    return level === 2 ? (
      <h2 {...props} id={id}>
        {props.children}
      </h2>
    ) : (
      <h3 {...props} id={id}>
        {props.children}
      </h3>
    );
  };
  return (
    <article className="container page-content">
      <div className="page-intro">
        <Link className="breadcrumb" href={`/${locale}/blog`}>
          <Icon name="chevron-left" /> Journal
        </Link>
        <p className="eyebrow">
          <time dateTime={article.date}>
            {new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
              new Date(article.date),
            )}
          </time>{' '}
          / {article.minutes} MIN
        </p>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
      </div>
      <div className="article-layout">
        <div className="prose">
          <MDXRemote
            source={article.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode, { theme: { dark: 'github-dark', light: 'github-light' } }],
                ],
              },
            }}
            components={{ h2: (props) => heading(props, 2), h3: (props) => heading(props, 3) }}
          />
        </div>
        {article.toc.length >= 4 && (
          <nav className="toc" aria-label={copy.blog_slug.on_this_page[locale]}>
            <p className="eyebrow">{copy.blog_slug.on_this_page[locale]}</p>
            {article.toc.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </nav>
        )}
      </div>
      <a
        className="text-link"
        style={{ marginTop: 60 }}
        href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${origin}/${locale}/blog/${slug}`)}`}
      >
        {copy.blog_slug.share_this_article[locale]} <Icon name="chevron-right" />
      </a>
    </article>
  );
}
