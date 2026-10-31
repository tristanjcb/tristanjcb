'use client';
import { flushSync } from 'react-dom';
let transition: ViewTransition | undefined;
let cleanup: ReturnType<typeof setTimeout> | undefined;
/** Animate a trusted theme selection; navigation and controls remain immediately usable. */
export function animateTheme(
  value: string,
  setTheme: (value: string) => void,
  control: HTMLElement,
) {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const next =
    value === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : value;
  if (!['light', 'dark'].includes(next)) return;
  transition?.skipTransition();
  clearTimeout(cleanup);
  root.dataset.themeTransition = 'true';
  const update = () => {
    flushSync(() => setTheme(value));
    root.dataset.theme = next;
    root.style.colorScheme = next;
  };
  const finish = () => {
    delete root.dataset.themeTransition;
  };
  if (typeof document.startViewTransition === 'function') {
    try {
      transition = document.startViewTransition(update);
      void transition.ready
        .then(() => {
          if (reduced) {
            root.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 180,
              pseudoElement: '::view-transition-new(root)',
            });
            return;
          }
          const rect = control.getBoundingClientRect();
          const x = rect.left + rect.width / 2,
            y = rect.top + rect.height / 2;
          const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
              duration: 520,
              easing: 'cubic-bezier(.2,.8,.2,1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {});
      void transition.finished.finally(finish).catch(() => {});
    } catch {
      update();
      cleanup = setTimeout(finish, 550);
    }
  } else {
    update();
    cleanup = setTimeout(finish, 550);
  }
}
