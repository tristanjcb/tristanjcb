import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chapters,
  position,
  quality,
  sceneSettings,
} from '../../src/components/cinematic/model.ts';
test('explore inputs are finite, bounded and restricted to known palettes', () => {
  assert.deepEqual(sceneSettings(Infinity, NaN, 'shader()'), {
    energy: 0.35,
    density: 0.5,
    palette: 'aurora',
  });
  assert.deepEqual(sceneSettings(-42, 900, 'ice'), { energy: 0, density: 1, palette: 'ice' });
});
test('all generated positions are finite and stay within the scene envelope', () => {
  for (const chapter of chapters)
    for (let u = 0; u <= 20; u++)
      for (let v = 0; v <= 20; v++)
        for (const coordinate of position(chapter, u / 20, v / 20)) {
          assert.ok(Number.isFinite(coordinate));
          assert.ok(Math.abs(coordinate) < 2);
        }
});
test('mobile and modest devices have a bounded GPU tier', () => {
  for (const tier of [quality(390, 12), quality(1440, 2)]) {
    assert.equal(tier.dpr, 1);
    assert.ok(tier.particles <= 80);
    assert.ok(tier.fps <= 24);
  }
  assert.ok(quality(1440, 12).dpr <= 1.5);
});
test('organic surfaces stay closed at their poles and periodic seam', () => {
  for (const chapter of chapters) {
    for (const v of [0, 1]) {
      const pole = position(chapter, 0, v);
      for (let u = 0; u <= 1; u += 0.1) {
        const candidate = position(chapter, u, v);
        assert.ok(
          candidate.every((value, i) => Math.abs(value - pole[i]) < 0.00001),
          `${chapter}: pole must not split`,
        );
      }
    }
    for (let v = 0; v <= 1; v += 0.1) {
      const a = position(chapter, 0, v),
        b = position(chapter, 1, v);
      assert.ok(a.every((value, i) => Math.abs(value - b[i]) < 0.00001));
    }
  }
  assert.equal(sceneSettings(Symbol('invalid'), {}, null).energy, 0.35);
});
