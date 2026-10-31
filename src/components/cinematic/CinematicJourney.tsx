'use client';
import { Icon } from '@/components/icons/Icon';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { cinematic, narrativeCode } from '@/content/cinematic';
import { type Locale } from '@/lib/i18n';
import { chapters, initialScene, sceneSettings, type Chapter } from './model';
import { setMode, useReducedMotion, useVisualMode } from './preferences';
import { Fallback } from './Fallback';
import type { Engine } from './renderer';
import styles from './Cinematic.module.scss';
const JourneyContext = createContext<{
  chapter: Chapter;
  state: React.RefObject<ReturnType<typeof initialScene>>;
  status: string;
  skip: () => void;
  phase: number;
  animated: boolean;
  invalidate: () => void;
}>({
  chapter: 'origin',
  state: { current: initialScene() },
  status: 'static',
  skip: () => {},
  phase: 4,
  animated: false,
  invalidate: () => {},
});
export function CinematicJourney({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const root = useRef<HTMLDivElement>(null),
    host = useRef<HTMLDivElement>(null),
    engine = useRef<Engine | null>(null),
    scene = useRef(initialScene());
  const mode = useVisualMode(),
    reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [chapter, setChapter] = useState<Chapter>('origin'),
    [status, setStatus] = useState('loading'),
    [phase, setPhase] = useState(0);
  const animated = mode === 'animated' || (mode === 'auto' && !reduced);
  const skip = () => setPhase(4);
  useEffect(() => {
    scene.current.motion = animated;
    engine.current?.update();
  }, [animated]);
  useEffect(() => {
    scene.current.dark = resolvedTheme !== 'light';
    engine.current?.update();
  }, [resolvedTheme]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const sections = Array.from(element.querySelectorAll<HTMLElement>('[data-universe]'));
    let pending = 0;
    const update = () => {
      pending = 0;
      let next: Chapter = 'origin';
      for (const section of sections) {
        if (section.getBoundingClientRect().top < innerHeight * 0.48) {
          const value = section.dataset.universe;
          if (chapters.includes(value as Chapter)) next = value as Chapter;
        }
      }
      if (scene.current.chapter !== next) {
        scene.current.chapter = next;
        engine.current?.update();
      }
      setChapter((previous) => (previous === next ? previous : next));
    };
    const scroll = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };
    const pointer = (event: PointerEvent) => {
      if (!scene.current.motion || event.pointerType !== 'mouse') return;
      scene.current.pointer = {
        x: Math.max(-1, Math.min(1, (event.clientX / innerWidth - 0.5) * 2)),
        y: Math.max(-1, Math.min(1, (event.clientY / innerHeight - 0.5) * 2)),
      };
    };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    element.addEventListener('pointermove', pointer, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      element.removeEventListener('pointermove', pointer);
    };
  }, []);
  useEffect(() => {
    if (reduced) return;
    const timers = [650, 1300, 1900, 2600].map((delay, index) =>
      setTimeout(() => setPhase((previous) => Math.max(previous, index + 1)), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false,
      visible = true,
      instance: Engine | null = null;
    let failed = false;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let due = false,
      started = false;
    const apply = () => {
      instance?.setActive(visible && !document.hidden);
      if (!document.hidden) launch();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        apply();
        if (visible) launch();
      },
      { rootMargin: '100px' },
    );
    if (root.current) observer.observe(root.current);
    document.addEventListener('visibilitychange', apply);
    const failure = () => {
      failed = true;
      clearTimeout(startupTimer);
      instance?.dispose();
      instance = null;
      engine.current = null;
      if (!cancelled) setStatus('unavailable');
    };
    const launch = () => {
      if (cancelled || document.hidden || !visible || !due || started) return;
      started = true;

      setStatus('loading');
      void import('./renderer')
        .then(async ({ createAurora }) => {
          if (cancelled || failed) return;
          try {
            instance = createAurora(element, scene, failure);
            engine.current = instance;
            startupTimer = setTimeout(failure, 15000);
            await instance.ready;
            if (cancelled || failed) return;
            clearTimeout(startupTimer);
            apply();
            setStatus('ready');
          } catch {
            failure();
          }
        })
        .catch(failure);
    };
    const timer = setTimeout(() => {
      due = true;
      launch();
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(startupTimer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', apply);
      instance?.dispose();
      engine.current = null;
    };
  }, []);
  const displayedStatus = status;
  return (
    <JourneyContext.Provider
      value={{
        chapter,
        state: scene,
        status: displayedStatus,
        skip,
        phase: reduced ? 4 : phase,
        animated,
        invalidate: () => engine.current?.update(),
      }}
    >
      <div
        ref={root}
        className={styles.journey}
        data-chapter={chapter}
        data-scene-motion={animated ? 'animated' : 'static'}
        data-scene-status={displayedStatus}
      >
        <div className={styles.rail} aria-hidden="true">
          <div className={styles.sticky}>
            <Fallback />
            <div ref={host} className={styles.canvas} data-scene-host />
            {displayedStatus === 'ready' && (
              <span className={styles.gpuLabel}>TRISTAN / REALTIME MATERIAL</span>
            )}
            <FloatingIDE locale={locale} />
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </JourneyContext.Provider>
  );
}
function FloatingIDE({ locale }: { locale: Locale }) {
  const { chapter, phase } = useContext(JourneyContext);
  const kind = chapter === 'music' ? 'audio' : chapter === 'creator' ? 'creator' : 'code';
  return (
    <aside
      className={styles.ide}
      data-kind={kind}
      data-visible={phase >= 3}
      aria-label={
        kind === 'code'
          ? cinematic.codeLabel[locale]
          : kind === 'audio'
            ? cinematic.audioLabel[locale]
            : cinematic.creatorLabel[locale]
      }
    >
      <div className={styles.ideBar}>
        <span className={styles.windowDots}>● ● ●</span>
        <span>
          {kind === 'audio'
            ? 'vykev.session'
            : kind === 'creator'
              ? 'composition.canvas'
              : 'universe.ts'}
        </span>
        <span>
          <Icon name="chevron-right" />
        </span>
      </div>
      {kind === 'code' ? (
        <pre>
          <code>
            {narrativeCode.map((line, index) => (
              <span key={line}>
                <i>{index + 1}</i>
                {line}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      ) : kind === 'audio' ? (
        <div className={styles.audio}>
          <div className={styles.wave}>
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%` }} />
            ))}
          </div>
          <p>VYKEV / {cinematic.noAudio[locale]}</p>
        </div>
      ) : (
        <div className={styles.composition}>
          <div />
          <div />
          <div />
          <span>FRAME / LIGHT / STORY</span>
        </div>
      )}
    </aside>
  );
}
export function UniverseControls({ locale }: { locale: Locale }) {
  const { state, status, skip, phase, animated, invalidate } = useContext(JourneyContext);
  const reduced = useReducedMotion();
  const [energy, setEnergy] = useState(0.35),
    [density, setDensity] = useState(0.5),
    [palette, setPalette] = useState('aurora');
  const update = (e: number, d: number, p: string) => {
    const values = sceneSettings(e, d, p);
    Object.assign(state.current, values);
    invalidate();
    setEnergy(values.energy);
    setDensity(values.density);
    setPalette(values.palette);
  };
  const phases = [
    cinematic.silence,
    cinematic.awakening,
    cinematic.identity,
    cinematic.code,
    cinematic.ready,
  ];
  return (
    <div className={styles.tools}>
      <div className={styles.introStatus}>
        <span className={styles.phase}>
          {String(Math.min(phase, 4) + 1).padStart(2, '0')} / {phases[Math.min(phase, 4)][locale]}
        </span>
        <button
          onClick={skip}
          disabled={phase >= 4}
          aria-hidden={phase >= 4}
          style={{ visibility: phase >= 4 ? 'hidden' : 'visible' }}
        >
          {cinematic.skip[locale]} <Icon name="chevron-right" />
        </button>
        <button
          onClick={() => setMode(animated ? 'static' : 'animated')}
          aria-pressed={!animated}
          disabled={status !== 'ready'}
        >
          {animated ? cinematic.staticMode[locale] : cinematic.animatedMode[locale]}
        </button>
      </div>
      <details className={styles.explore}>
        <summary>
          {cinematic.explore[locale]} <span>+</span>
        </summary>
        <div className={styles.sliders}>
          <label htmlFor="aurora-energy">
            {cinematic.energy[locale]}
            <output>{Math.round(energy * 100)}%</output>
            <input
              type="range"
              id="aurora-energy"
              aria-label={cinematic.energy[locale]}
              min="0"
              max="1"
              step=".05"
              value={energy}
              onChange={(event) => update(Number(event.target.value), density, palette)}
              disabled={status !== 'ready'}
            />
          </label>
          <label htmlFor="aurora-density">
            {cinematic.density[locale]}
            <output>{Math.round(density * 100)}%</output>
            <input
              type="range"
              id="aurora-density"
              aria-label={cinematic.density[locale]}
              min="0"
              max="1"
              step=".05"
              value={density}
              onChange={(event) => update(energy, Number(event.target.value), palette)}
              disabled={status !== 'ready'}
            />
          </label>
          <label>
            {cinematic.palette[locale]}
            <select
              aria-label={cinematic.palette[locale]}
              disabled={status !== 'ready'}
              value={palette}
              onChange={(event) => update(energy, density, event.target.value)}
            >
              <option value="aurora">Tristan</option>
              <option value="ice">Ice</option>
              <option value="rose">Rose</option>
            </select>
          </label>
          <button onClick={() => update(0.35, 0.5, 'aurora')}>
            {cinematic.reset[locale]} <Icon name="reset" />
          </button>
        </div>
        <p>
          {reduced
            ? cinematic.reduced[locale]
            : status === 'unavailable'
              ? cinematic.unavailable[locale]
              : status === 'loading'
                ? cinematic.loading[locale]
                : cinematic.quality[locale]}
        </p>
      </details>
    </div>
  );
}
