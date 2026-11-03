import { copy } from '@/content/copy';
import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { metadata } from '@/lib/seo';
import { ProjectIndex } from '@/components/ProjectIndex';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale)
    ? metadata(
        locale,
        '/projects',
        ui.projects[locale],
        copy.projects.development_music_and_creation_the_projects[locale],
      )
    : {};
}
export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="container page-content">
      <div className="page-intro">
        <p className="eyebrow">THE WORK / THREE DISCIPLINES</p>
        <h1>
          {copy.projects.ideas[locale]}
          <br />
          <span className="serif">{copy.projects.taking_shape[locale]}</span>
        </h1>
        <p>{copy.projects.from_development_to_music_each_project[locale]}</p>
      </div>
      <ProjectIndex locale={locale} />
    </div>
  );
}
