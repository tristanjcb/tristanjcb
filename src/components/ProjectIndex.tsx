'use client';
import { useState } from 'react';
import { projects, categories, type Category } from '@/content/projects';
import { ui, type Locale } from '@/lib/i18n';
import { ProjectCard } from './ProjectCard';
export function ProjectIndex({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const visible = projects.filter((project) => category === 'all' || project.category === category);
  return (
    <>
      <div
        className="filters"
        aria-label={locale === 'fr' ? 'Filtrer les projets' : 'Filter projects'}
      >
        {(['all', ...categories.map((category) => category.id)] as const).map((value) => (
          <button
            className="filter"
            key={value}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {ui[value][locale]}
          </button>
        ))}
      </div>
      <output className="sr-only">
        {visible.length} {locale === 'fr' ? 'projets' : 'projects'}
      </output>
      <div className="project-grid">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    </>
  );
}
