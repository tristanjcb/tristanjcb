import { text, type Localized } from '../lib/i18n.ts';
export const categories = [
  { id: 'dev', title: text('Développement', 'Development'), number: '01', color: 'violet' },
  { id: 'music', title: text('Musique', 'Music'), number: '02', color: 'cyan' },
  { id: 'creator', title: text('Création', 'Creator'), number: '03', color: 'pink' },
] as const;
export type Category = (typeof categories)[number]['id'];
export interface Project {
  slug: string;
  category: Category;
  title: string;
  subtitle: Localized;
  status: Localized;
  description: Localized;
  role?: Localized;
  context?: Localized;
  problem?: Localized;
  approach?: Localized;
  tools?: string[];
  results?: Localized[];
  gallery?: { src: string; alt: Localized; width: number; height: number }[];
  links?: { label: string; href: string }[];
  teaser?: boolean;
}
export const projects: Project[] = [
  {
    slug: 'kresov',
    category: 'dev',
    title: 'Kresov',
    subtitle: text('Des communautés, un langage commun.', 'Communities. A common language.'),
    status: text('Projet · Freemium', 'Project · Freemium'),
    description: text(
      'Un bot Discord internationalisé, construit autour d’une architecture entièrement modulaire et d’un modèle freemium.',
      'An internationalized Discord bot, built around a fully modular architecture and a freemium model.',
    ),
    context: text(
      'Un projet au croisement du développement d’outils et de la vie des communautés Discord.',
      'A project at the intersection of building tools and Discord communities.',
    ),
    approach: text(
      'Une architecture 100 % modulaire, avec l’internationalisation au cœur du projet.',
      'A 100% modular architecture, with internationalization at its core.',
    ),
    links: [{ label: 'kresov.com', href: 'https://kresov.com' }],
  },
  {
    slug: 'dockerscope',
    category: 'dev',
    title: 'DockerScope',
    subtitle: text('Un regard sur les conteneurs.', 'A closer look at containers.'),
    status: text('Projet', 'Project'),
    description: text(
      'Un agent de monitoring Docker, un panneau de contrôle des conteneurs et une intégration CI/CD. Les détails techniques seront documentés après vérification.',
      'A Docker monitoring agent, a container control panel, and CI/CD integration. Technical details will be documented after verification.',
    ),
  },
  {
    slug: 'cursed',
    category: 'music',
    title: 'EP.1: Cursed',
    subtitle: text('Vykev · Premier chapitre', 'Vykev · First chapter'),
    status: text('Présentation bientôt disponible', 'Presentation coming soon'),
    description: text(
      'Cursed est le premier EP de Vykev. Un premier chapitre musical, dont la présentation détaillée et les liens d’écoute restent à venir.',
      'Cursed is Vykev’s first EP. A first musical chapter, with its full presentation and listening links still to come.',
    ),
  },
  {
    slug: 'ep-2',
    category: 'music',
    title: 'EP.2: ???',
    subtitle: text(
      'Vykev · La suite reste un mystère.',
      'Vykev · The next chapter stays a mystery.',
    ),
    status: text('Bientôt', 'Coming soon'),
    description: text(
      'Un titre en suspens. Un nouveau chapitre à découvrir quand le moment sera venu.',
      'A title left open. A new chapter to discover when the time is right.',
    ),
    teaser: true,
  },
  {
    slug: 'coming-soon',
    category: 'creator',
    title: 'Creator',
    subtitle: text('Un espace pour les prochaines idées.', 'A space for the next ideas.'),
    status: text('Bientôt', 'Coming soon'),
    description: text(
      'La création de contenu a sa place dans Aurora. Cet espace attend les premiers formats à partager.',
      'Content creation has a place in Aurora. This space is waiting for its first formats to share.',
    ),
    teaser: true,
  },
];
export const releases = projects.filter((project) => project.category === 'music');
export const projectPath = (project: Pick<Project, 'category' | 'slug'>) =>
  `/projects/${project.category}/${project.slug}`;
