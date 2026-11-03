import { Icon } from '@/components/icons/Icon';
export const dynamicParams = false;
import { copy } from '@/content/copy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, projects } from '@/content/projects';
import { isLocale, locales, ui } from '@/lib/i18n';
import { ProjectCard } from '@/components/ProjectCard';
import { metadata } from '@/lib/seo';
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.id })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const item = categories.find((item) => item.id === category);
  return isLocale(locale) && item
    ? metadata(
        locale,
        `/projects/${category}`,
        item.title[locale],
        copy.projects_category.one_discipline_another_view_of_aurora[locale],
      )
    : {};
}
export default async function Category({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const item = categories.find((item) => item.id === category);
  if (!isLocale(locale) || !item) notFound();
  return (
    <div className="container page-content">
      <div className="page-intro">
        <Link className="breadcrumb" href={`/${locale}/projects`}>
          <Icon name="chevron-left" /> {ui.back[locale]}
        </Link>
        <p className="eyebrow">
          {item.number} / {category === 'music' ? 'VYKEV' : 'TRISTAN'}
        </p>
        <h1>
          {item.title[locale]}
          <span className="accent">.</span>
        </h1>
        <p>
          {category === 'music'
            ? copy.projects_category.two_chapters_the_first_has_a[locale]
            : category === 'creator'
              ? copy.projects_category.the_next_space_for_expression_new[locale]
              : copy.projects_category.building_tools_understanding_systems_continuing_to[locale]}
        </p>
      </div>
      <div className="filters">
        {categories.map((cat) => (
          <Link
            className="filter"
            aria-current={cat.id === category ? 'page' : undefined}
            key={cat.id}
            href={`/${locale}/projects/${cat.id}`}
          >
            {cat.title[locale]}
          </Link>
        ))}
      </div>
      <div className="project-grid">
        {projects
          .filter((project) => project.category === category)
          .map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
      </div>
    </div>
  );
}
