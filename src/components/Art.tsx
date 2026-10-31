import styles from './Art.module.scss';
export function Art({
  variant = 'origin',
  compact = false,
}: {
  variant?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`${styles.art} ${compact ? styles.compact : ''}`}
      data-variant={variant}
      data-aurora-art
      aria-hidden="true"
    >
      <div className={styles.grid} />
      <div className={styles.halo} />
      <div className={styles.orbit} />
      <div className={styles.orbit2} />
      <svg viewBox="0 0 600 520" fill="none">
        <path
          d="M155 390 300 100l145 290h-82l-63-132-63 132Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="m192 390 108-218 108 218M156 390h289M300 100v320"
          stroke="currentColor"
          strokeOpacity=".3"
        />
        <circle cx="300" cy="280" r="170" stroke="currentColor" strokeOpacity=".2" />
        <path d="M55 280h490M300 30v460" stroke="currentColor" strokeOpacity=".15" />
        <circle cx="300" cy="100" r="4" fill="currentColor" />
        <circle cx="445" cy="390" r="4" fill="currentColor" />
      </svg>
      <span className={styles.annotation}>
        A / {variant === 'origin' ? 'ORIGIN' : variant.toUpperCase()}
        <br />
        CODE / SOUND / STORIES
        <br />
        DIGITAL EXPLORATIONS
      </span>
      <span className={styles.coordinate}>
        FIG. 001
        <br />
        THREE WORLDS. ONE ORIGIN.
      </span>
    </div>
  );
}
