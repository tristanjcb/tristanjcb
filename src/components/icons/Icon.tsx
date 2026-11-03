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
  reset: 'M3 10a9 9 0 1 1 1 8M3 3v7h7',
} as const;
const filledMarks = {
  linkedin:
    'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM5 9h3v10H5V9Zm1.5-4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM10 9h3v1.4c.6-1 1.6-1.7 3-1.7 2.7 0 3.5 1.7 3.5 4.3v6h-3v-5.4c0-1.4-.3-2.3-1.6-2.3-1.4 0-1.9 1-1.9 2.3V19h-3V9Z',
} as const;
export type IconName = keyof typeof strokes | keyof typeof brandPaths | keyof typeof filledMarks;
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const localFill = name in filledMarks;
  const brand = name in brandPaths || localFill;
  return (
    <svg
      className={`icon ${className ?? ''}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={brand ? 'currentColor' : 'none'}
      fillRule={localFill ? 'evenodd' : undefined}
      stroke={brand ? 'none' : 'currentColor'}
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          localFill
            ? filledMarks[name as keyof typeof filledMarks]
            : brand
              ? brandPaths[name as keyof typeof brandPaths]
              : strokes[name as keyof typeof strokes]
        }
      />
    </svg>
  );
}
