import { getArticles } from '@/lib/articles';
import { xmlEscape } from '@/lib/article-schema';
import { origin } from '@/lib/seo';
export const dynamic = 'force-static';
export async function GET() {
  const articles = await getArticles();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Tristan · Journal</title><link>${origin}</link><description>Code, sound, stories. Le journal de Tristan.</description><atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml"/>${articles.map((article) => `<item><title>${xmlEscape(article.title)}</title><link>${origin}/${article.locale}/blog/${article.slug}</link><guid>${origin}/${article.locale}/blog/${article.slug}</guid><description>${xmlEscape(article.description)}</description><pubDate>${new Date(article.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
