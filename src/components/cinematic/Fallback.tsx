import styles from './Cinematic.module.scss';
// SSR-first artwork. Always present beneath the optional GPU canvas; never a loading gate.
export function Fallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <div className={styles.aura} />
      <div className={styles.organic} />
      <svg viewBox="0 0 640 640" fill="none">
        <ellipse cx="320" cy="320" rx="245" ry="100" transform="rotate(-32 320 320)" />
        <ellipse cx="320" cy="320" rx="245" ry="100" transform="rotate(32 320 320)" />
        <circle cx="320" cy="320" r="260" strokeDasharray="1 18" />
        <path d="M40 320h560M320 40v560" opacity=".2" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            cx={320 + Math.cos(i * 2.4) * 255}
            cy={320 + Math.sin(i * 2.4) * 255}
            r={i % 3 === 0 ? 2 : 1}
          />
        ))}
      </svg>
    </div>
  );
}
