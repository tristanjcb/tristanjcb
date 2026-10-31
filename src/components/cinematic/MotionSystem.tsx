'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motionEvent, readMode } from './preferences';
import styles from './Motion.module.scss';
// One motion boundary; effects never own navigation, focus or content availability.
export function MotionSystem() {
  const path = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const disabled = () => media.matches || readMode() === 'static';
    const sync = () => {
      document.documentElement.dataset.motion = disabled() ? 'off' : 'on';
      if (disabled()) {
        curtain.current?.getAnimations().forEach((animation) => animation.cancel());
        document
          .querySelectorAll('[data-scene-host]')
          .forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
        document
          .querySelectorAll('[data-reveal]')
          .forEach((element) => element.removeAttribute('data-reveal'));
      }
    };
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'visible');
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' },
    );
    const artwork = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.setAttribute('data-art-active', String(entry.isIntersecting)),
        ),
      { rootMargin: '80px' },
    );
    document.querySelectorAll('[data-aurora-art]').forEach((element) => artwork.observe(element));
    sync();
    if (!disabled())
      document.querySelectorAll('main h2,main .project-card').forEach((element) => {
        if (element.getBoundingClientRect().top > innerHeight) {
          element.setAttribute('data-reveal', 'pending');
          reveal.observe(element);
        }
      });
    const navigate = (event: MouseEvent) => {
      if (
        disabled() ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self'))
        return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.pathname === location.pathname) return;
      curtain.current?.getAnimations().forEach((animation) => animation.cancel());
      curtain.current?.animate(
        [
          { opacity: 0, transform: 'translateY(100%)' },
          { opacity: 0.35, transform: 'translateY(0)', offset: 0.3 },
          { opacity: 0, transform: 'translateY(-100%)' },
        ],
        { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' },
      );
    };
    const surprise = (event: KeyboardEvent) => {
      if (
        disabled() ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (event.key === '*') {
        document
          .querySelector<HTMLElement>('[data-scene-host]')
          ?.animate(
            [
              { filter: 'hue-rotate(0deg)' },
              { filter: 'hue-rotate(35deg)' },
              { filter: 'hue-rotate(0deg)' },
            ],
            { duration: 900, easing: 'ease-in-out' },
          );
      }
    };
    document.addEventListener('click', navigate, true);
    window.addEventListener(motionEvent, sync);
    window.addEventListener('storage', sync);
    media.addEventListener('change', sync);
    window.addEventListener('keydown', surprise);
    return () => {
      reveal.disconnect();
      artwork.disconnect();
      document
        .querySelectorAll('[data-reveal]')
        .forEach((element) => element.removeAttribute('data-reveal'));
      document.removeEventListener('click', navigate, true);
      window.removeEventListener(motionEvent, sync);
      window.removeEventListener('storage', sync);
      media.removeEventListener('change', sync);
      window.removeEventListener('keydown', surprise);
    };
  }, [path]);
  return <div ref={curtain} className={styles.curtain} aria-hidden="true" data-aurora-curtain />;
}
