import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import { articleSchema, readingMinutes, headingId } from './article-schema';
import type { Locale } from './i18n';
import { articleNames } from './content-files';
export const getArticles = cache(async (locale?: Locale) => {
  const directory = path.join(process.cwd(), 'src/content/articles');
  const names = await articleNames(directory);
  const articles = await Promise.all(
    names.map(async (name) => {
      const { data, content } = matter(await fs.readFile(path.join(directory, name), 'utf8'));
      const metadata = articleSchema.parse(data);
      const ids = new Map<string, number>();
      let inCode = false;
      const toc = content.split('\n').flatMap((line) => {
        if (/^\s*```/.test(line)) {
          inCode = !inCode;
          return [];
        }
        if (inCode) return [];
        const match = /^(#{2,3})\s+(.+)$/.exec(line);
        if (!match) return [];
        const title = match[2].replace(/[*_`]/g, '');
        const base = headingId(title);
        const count = ids.get(base) ?? 0;
        ids.set(base, count + 1);
        return [{ title, id: count ? `${base}-${count}` : base, depth: match[1].length }];
      });
      return { ...metadata, content, minutes: readingMinutes(content), toc };
    }),
  );
  const published = articles.filter(
    (article) => article.published && article.date <= new Date().toISOString().slice(0, 10),
  );
  const keys = new Set<string>();
  for (const article of articles) {
    const key = `${article.locale}/${article.slug}`;
    if (keys.has(key)) throw new Error(`Duplicate article: ${key}`);
    keys.add(key);
  }
  return published
    .filter((article) => !locale || article.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
});
