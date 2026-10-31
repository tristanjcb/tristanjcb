import { brandPaths } from './brands';
const strokes = {
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M6 18 18 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  search: 'M21 21l-5-5M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15',
  'chevron-right': 'm9 5 7 7-7 7',
  'chevron-left': 'm15 5-7 7 7 7',
  down: 'm6 9 6 6 6-6',
  external: 'M15 3h6v6M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 1 9 7 9-7',
  message:
    'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-10.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5ZM7 10h10M7 14h6',
  linkedin:
    'M5 9v11M5 5v.01M10 20V9h4v2c1-3 7-3 7 2v7M14 11v9M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1',
  reset: 'M3 10a9 9 0 1 1 1 8M3 3v7h7',
} as const;
export type IconName = keyof typeof strokes | keyof typeof brandPaths;
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const brand = name in brandPaths;
  return (
    <svg
      className={`icon ${className ?? ''}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={brand ? 'currentColor' : 'none'}
      stroke={brand ? 'none' : 'currentColor'}
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          brand
            ? brandPaths[name as keyof typeof brandPaths]
            : strokes[name as keyof typeof strokes]
        }
      />
    </svg>
  );
}
