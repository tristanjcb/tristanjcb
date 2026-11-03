import { text } from '../lib/i18n';
export const cinematic = {
  staticMode: text('Mode statique', 'Static mode'),
  animatedMode: text('Animer la 3D', 'Animate 3D'),
  skip: text('Passer l’intro', 'Skip intro'),
  explore: text('Explorer la matière', 'Explore the material'),
  energy: text('Énergie', 'Energy'),
  density: text('Particules', 'Particles'),
  palette: text('Palette', 'Palette'),
  reset: text('Réinitialiser', 'Reset'),
  quality: text(
    'Visuel décoratif. Le contenu reste toujours accessible.',
    'Decorative visual. The content is always accessible.',
  ),
  reduced: text(
    'La 3D reste visible, sans mouvement. Les animations de l’interface restent indépendantes.',
    'The 3D remains visible without movement. Interface animations stay independent.',
  ),
  loading: text('La lumière prend forme…', 'Light is taking shape…'),
  unavailable: text(
    'Composition statique · 3D indisponible',
    'Static composition · 3D unavailable',
  ),
  mobile: text(
    'Composition légère · 3D haute définition',
    'Lightweight composition · high-definition 3D',
  ),
  phase: text('Chapitre', 'Chapter'),
  silence: text('Silence', 'Silence'),
  awakening: text('Éveil', 'Awakening'),
  identity: text('Identité', 'Identity'),
  code: text('L’idée prend forme', 'An idea takes shape'),
  ready: text('Explorer', 'Explore'),
  codeLabel: text('', ''),
  audioLabel: text('', ''),
  creatorLabel: text('Panneau de composition décoratif', 'Decorative composition panel'),
  noAudio: text('EP.1: Cursed', 'No audio · visual preview'),
  surprise: text('Changer la constellation', 'Change the constellation'),
};
export const narrativeCode = [
  'const universe = {',
  "  origin: 'life',",
  "  code: 'build with ❤',",
  "  sound: 'Vykev',",
  "  stories: 'still unfolding',",
  '};',
];
