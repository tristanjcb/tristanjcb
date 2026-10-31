import test from 'node:test';
import assert from 'node:assert/strict';
import { preferredLocale, isLocale } from '../../src/lib/i18n.ts';
import {
  articleSchema,
  xmlEscape,
  readingMinutes,
  headingId,
} from '../../src/lib/article-schema.ts';
test('explicit language preference wins and regional languages are normalized', () => {
  assert.equal(preferredLocale('en', 'fr-FR'), 'en');
  assert.equal(preferredLocale(undefined, 'en-US;q=0.3,fr-FR;q=0.9'), 'fr');
  assert.equal(preferredLocale(undefined, 'de, en-GB;q=0.8'), 'en');
  assert.equal(preferredLocale(undefined, 'de,en;q=0'), 'fr');
  assert.equal(isLocale('FR'), false);
});
test('malformed preferences safely fall back', () => {
  assert.equal(preferredLocale('xx', 'en;q=invalid,fr;q=0'), 'fr');
  assert.equal(preferredLocale(undefined, ''), 'fr');
});
test('article metadata requires a valid date and safe slug, defaults to draft', () => {
  const base = {
    title: 'A real note',
    description: 'Description',
    locale: 'fr',
    slug: 'a-note',
    date: '2026-10-31',
  };
  assert.equal(articleSchema.parse(base).published, false);
  for (const date of ['2026-02-30', 'invalid'])
    assert.equal(articleSchema.safeParse({ ...base, date }).success, false);
  assert.equal(articleSchema.safeParse({ ...base, slug: '../secret' }).success, false);
});
test('RSS escapes all XML delimiters', () =>
  assert.equal(xmlEscape('<code & "sound">\''), '&lt;code &amp; &quot;sound&quot;&gt;&apos;'));
test('reading time excludes fenced code and headings normalize accents', () => {
  assert.equal(readingMinutes('A note\n```ts\n' + 'word '.repeat(1000) + '\n```'), 1);
  assert.equal(readingMinutes('word '.repeat(401)), 3);
  assert.equal(headingId('Créer & comprendre !'), 'creer-comprendre');
});
test('local MDX compiles headings, GFM and highlighted code', async () => {
  const { compileMDX } = await import('next-mdx-remote/rsc');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: remarkGfm } = await import('remark-gfm');
  const { default: prettyCode } = await import('rehype-pretty-code');
  const { content } = await compileMDX({
    source:
      '## A test heading\n\n- [x] Verified\n\n```ts\nconst language: string = "TypeScript";\n```',
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[prettyCode, { theme: { dark: 'github-dark', light: 'github-light' } }]],
      },
    },
  });
  const html = renderToStaticMarkup(content);
  assert.match(html, /A test heading/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /data-language="ts"/);
  assert.match(html, /--shiki-dark/);
});
