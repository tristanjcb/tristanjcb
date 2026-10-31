import Link from 'next/link';
import { type Project, projectPath } from '@/content/projects';
import { type Locale } from '@/lib/i18n';
import { Art } from './Art';
export function ProjectCard({
  project,
  locale,
  featured = false,
}: {
  project: Project;
  locale: Locale;
  featured?: boolean;
}) {
  return (
    <article
      className={`project-card ${featured ? 'featured-card' : ''}`}
      data-category={project.category}
    >
      <Link
        href={`/${locale}${projectPath(project)}`}
        className="project-visual"
        aria-label={project.title}
      >
        <Art variant={project.slug} compact={!featured} />
        {project.teaser && <span className="soon-badge">{project.status[locale]}</span>}
      </Link>
      <div className="project-caption">
        <div>
          <p className="eyebrow">
            {project.category === 'music' ? 'VYKEV / ' : ''}
            {project.status[locale]}
          </p>
          <h3>
            <Link href={`/${locale}${projectPath(project)}`}>{project.title}</Link>
          </h3>
          <p>{project.subtitle[locale]}</p>
        </div>
        <Link
          className="arrow-link"
          href={`/${locale}${projectPath(project)}`}
          aria-label={project.title}
        >
          ↗
        </Link>
      </div>
    </article>
  );
}
