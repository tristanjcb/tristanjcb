export const chapters = ['origin', 'development', 'music', 'creator', 'projects'] as const;
export type Chapter = (typeof chapters)[number];
export const palettes = ['aurora', 'ice', 'rose'] as const;
export type Palette = (typeof palettes)[number];
export type VisualMode = 'auto' | 'static' | 'animated';
export type SceneState = {
  chapter: Chapter;
  energy: number;
  density: number;
  palette: Palette;
  dark: boolean;
  motion: boolean;
  pointer: { x: number; y: number };
};
export const initialScene = (): SceneState => ({
  chapter: 'origin',
  energy: 0.35,
  density: 0.5,
  palette: 'aurora',
  dark: true,
  motion: false,
  pointer: { x: 0, y: 0 },
});
export function bounded(value: unknown, min: number, max: number, fallback: number): number {
  const number =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : NaN;
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
export function sceneSettings(energy: unknown, density: unknown, palette: unknown) {
  return {
    energy: bounded(energy, 0, 1, 0.35),
    density: bounded(density, 0, 1, 0.5),
    palette: palettes.includes(palette as Palette) ? (palette as Palette) : ('aurora' as Palette),
  };
}
export function quality(width: number, cores: number) {
  const modest = width <= 700 || cores <= 4;
  return {
    modest,
    dpr: 2,
    fps: modest ? 30 : 60,
    particles: modest ? 80 : 200,
    segments: modest ? 48 : 64,
  };
}
// Pure, deterministic parametric positions. No visitor code or shader source is evaluated.
export function position(chapter: Chapter, u: number, v: number): [number, number, number] {
  const phi = u * Math.PI * 2,
    theta = v * Math.PI;
  const x = Math.cos(phi) * Math.sin(theta),
    y = Math.cos(theta),
    z = Math.sin(phi) * Math.sin(theta);
  if (chapter === 'development') {
    const power = (value: number) => Math.sign(value) * Math.abs(value) ** 0.55;
    return [power(x) * 1.18, power(y) * 1.18, power(z) * 1.18];
  }
  if (chapter === 'music') {
    const ripple = Math.sin(theta) ** 2;
    const wave = 1 + 0.16 * Math.sin(phi * 8) * ripple;
    return [x * 1.4 * wave, y * 0.7 + 0.12 * Math.sin(phi * 6) * ripple, z * 1.4 * wave];
  }
  const radius =
    1.25 + 0.17 * Math.sin(phi * 3 + theta * 2) * Math.sin(theta) ** 2 + 0.1 * Math.cos(theta * 5);
  if (chapter === 'creator') {
    const r = radius + 0.23 * Math.sin(phi * 5) * Math.sin(theta) ** 2;
    const twist = y * 0.65;
    return [
      r * (x * Math.cos(twist) - z * Math.sin(twist)),
      y * 1.3,
      r * (x * Math.sin(twist) + z * Math.cos(twist)),
    ];
  }
  const scale = chapter === 'projects' ? 0.52 : 1;
  return [x * radius * scale, y * radius * 1.13 * scale, z * radius * scale];
}
