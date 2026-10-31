export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export const text = (fr: string, en: string): Localized => ({ fr, en });
export function preferredLocale(cookie?: string, accept = ''): Locale {
  if (cookie && isLocale(cookie)) return cookie;
  const candidates = accept
    .split(',')
    .map((part) => {
      const [language, quality] = part.trim().split(';');
      return {
        language: language.toLowerCase().split('-')[0],
        quality: quality?.startsWith('q=') ? Number(quality.slice(2)) : 1,
      };
    })
    .filter((candidate) => candidate.quality > 0)
    .sort((a, b) => b.quality - a.quality);
  return (candidates.find((candidate) => isLocale(candidate.language))?.language as Locale) ?? 'fr';
}
export const ui = {
  home: text('Origine', 'Origin'),
  me: text('À propos', 'Behind the screen'),
  projects: text('Projets', 'Selected work'),
  blog: text('Journal', 'Journal'),
  sponsors: text('Soutenir', 'Sponsors'),
  contact: text('Contact', 'Contact'),
  skip: text('Aller au contenu', 'Skip to content'),
  menu: text('Menu', 'Menu'),
  close: text('Fermer', 'Close'),
  search: text('Rechercher', 'Search'),
  searchPlaceholder: text('Une page, un projet, une idée…', 'A page, a project, an idea…'),
  noResults: text('Aucun résultat. Essayez un autre mot.', 'No results. Try another word.'),
  all: text('Tous', 'All'),
  dev: text('Développement', 'Development'),
  music: text('Musique', 'Music'),
  creator: text('Création', 'Creator'),
  soon: text('Bientôt', 'Coming soon'),
  discover: text('Explorer le projet', 'Explore the project'),
  back: text('Tous les projets', 'All projects'),
  empty: text('Une page blanche, pour les bonnes idées.', 'A blank page. Room for good ideas.'),
  emptyBody: text(
    'Les premiers articles trouveront bientôt leur place ici. Pas de bruit, juste des choses à partager.',
    'The first stories will find their place here. Less noise, more things worth sharing.',
  ),
  theme: text('Thème', 'Theme'),
  system: text('Système', 'System'),
  light: text('Clair', 'Light'),
  dark: text('Sombre', 'Dark'),
  cta: text('Et si on créait\nquelque chose ?', 'What could we\nmake together?'),
  ctaBody: text(
    'Un projet, une idée ou simplement une conversation. Le point de départ peut être aussi simple que ça.',
    'A project, an idea, or just a conversation. That is all a beginning needs.',
  ),
  send: text('Écrire un message', 'Start a conversation'),
  draft: text(
    'Textes éditoriaux provisoires · aucune métrique inventée.',
    'Provisional editorial copy · no invented metrics.',
  ),
};
export const navigation = [
  { key: 'home', path: '' },
  { key: 'projects', path: '/projects' },
  { key: 'me', path: '/me' },
  { key: 'blog', path: '/blog' },
  { key: 'sponsors', path: '/sponsors' },
  { key: 'contact', path: '/contact' },
] as const;
