'use client';
import { useSyncExternalStore } from 'react';
import type { VisualMode } from './model';
export const motionEvent = 'aurora:motion';
let transient: VisualMode = 'auto';
export function readMode(): VisualMode {
  try {
    const value = localStorage.getItem('aurora-visual-mode');
    return value === 'static' || value === 'animated' ? value : transient;
  } catch {
    return transient;
  }
}
export function setMode(mode: VisualMode) {
  transient = mode;
  try {
    localStorage.setItem('aurora-visual-mode', mode);
  } catch {
    /* Browser-local preference still works when storage is unavailable. */
  }
  window.dispatchEvent(new Event(motionEvent));
}
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(motionEvent, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(motionEvent, callback);
  };
}
export function useVisualMode() {
  return useSyncExternalStore(subscribe, readMode, () => 'auto' as VisualMode);
}
export function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const query = matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', callback);
      return () => query.removeEventListener('change', callback);
    },
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
}
