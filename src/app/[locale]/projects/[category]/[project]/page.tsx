import { Icon } from '@/components/icons/Icon';
export const dynamicParams = false;
import { copy } from '@/content/copy';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projects, projectPath, categories } from '@/content/projects';
import { isLocale, locales, ui } from '@/lib/i18n';
import { metadata } from '@/lib/seo';
import { Art } from '@/components/Art';
type Params = { locale: string; category: string; project: string };
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, category: project.category, project: project.slug })),
  );
}
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, category, project: slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.category === category);
  return isLocale(locale) && project
    ? metadata(locale, projectPath(project), project.title, project.description[locale])
    : {};
}
export default async function Detail({ params }: { params: Promise<Params> }) {
  const { locale, category, project: slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.category === category);
  if (!isLocale(locale) || !project) notFound();
  const sections = [
    { title: copy.projects_category_project.context, body: project.context },
    { title: copy.projects_category_project.role, body: project.role },
    { title: copy.projects_category_project.the_problem, body: project.problem },
    { title: copy.projects_category_project.the_approach, body: project.approach },
  ];
  return (
    <div className="container page-content" data-category={category}>
      <div className="page-intro">
        <Link className="breadcrumb" href={`/${locale}/projects/${category}`}>
          <Icon name="chevron-left" />{' '}
          {categories.find((item) => item.id === category)!.title[locale]}
        </Link>
        <p className="eyebrow">
          {project.status[locale]}
          {category === 'music' ? ' / VYKEV' : ''}
        </p>
        <h1>{project.title}</h1>
        <p>{project.subtitle[locale]}</p>
      </div>
      <div className="detail-hero">
        <Art variant={project.slug} />
      </div>
      <div className="detail-intro">
        <div>
          <p className="eyebrow">{project.teaser ? ui.soon[locale] : 'OVERVIEW'}</p>
          <h2>
            {project.teaser
              ? copy.projects_category_project.the_next_chapter_is_taking_shape[locale]
              : copy.projects_category_project.the_idea_in_a_few_words[locale]}
          </h2>
          <p>{project.description[locale]}</p>
        </div>
        {project.links?.map((link) => (
          <a className="text-link" key={link.href} href={link.href}>
            {link.label} <Icon name="chevron-right" />
          </a>
        ))}
      </div>
      <div style={{ marginTop: 60 }}>
        {sections
          .filter((section) => section.body)
          .map((section) => (
            <section key={section.title.en} className="detail-facts">
              <h2>{section.title[locale]}</h2>
              <p>{section.body![locale]}</p>
            </section>
          ))}
        {project.tools?.length ? (
          <section className="detail-facts">
            <h2>{copy.projects_category_project.tools[locale]}</h2>
            <p>{project.tools.join(' / ')}</p>
          </section>
        ) : null}
        {project.results?.length ? (
          <section className="detail-facts">
            <h2>{copy.projects_category_project.verified_results[locale]}</h2>
            <ul>
              {project.results.map((result) => (
                <li key={result.en}>{result[locale]}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {project.gallery?.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt[locale]}
            width={image.width}
            height={image.height}
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
      <Link className="text-link" href={`/${locale}/projects`}>
        <Icon name="chevron-left" /> {ui.back[locale]}
      </Link>
    </div>
  );
}
