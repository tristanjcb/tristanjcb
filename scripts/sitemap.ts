import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { projects, projectPath } from '../src/content/projects.ts';
import { articleSchema, xmlEscape } from '../src/lib/article-schema.ts';
const origin = 'https://tristan.kresov.com';
const paths = [
  '',
  '/me',
  '/projects',
  '/projects/dev',
  '/projects/music',
  '/projects/creator',
  '/blog',
  '/sponsors',
  '/contact',
];
const projectPaths = projects.map((project) => projectPath(project));
const entries = ['fr', 'en'].flatMap((locale) =>
  [...paths, ...projectPaths].map((path) => ({ locale, path })),
);
for (const name of await fs.readdir(new URL('../src/content/articles/', import.meta.url))) {
  if (!name.endsWith('.mdx')) continue;
  const { data } = matter(
    await fs.readFile(new URL(`../src/content/articles/${name}`, import.meta.url), 'utf8'),
  );
  const article = articleSchema.parse(data);
  if (article.published && article.date <= new Date().toISOString().slice(0, 10))
    entries.push({ locale: article.locale, path: `/blog/${article.slug}` });
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((entry) => `  <url><loc>${xmlEscape(`${origin}/${entry.locale}${entry.path}`)}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`Sitemap: ${entries.length} canonical URLs`);
