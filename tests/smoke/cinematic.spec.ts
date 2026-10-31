import { test, expect } from '@playwright/test';
test('reduced motion preserves a complete static site without a GPU canvas', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr');
  await expect(page.locator('[data-scene-status]')).toHaveAttribute('data-scene-status', 'static');
  await expect(page.locator('canvas[data-aurora-canvas]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('static-fallback.png') });
  await expect(page.getByRole('button', { name: 'Mode statique', exact: true })).toBeDisabled();
  await page.getByRole('link', { name: 'Projets ↗', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/projects$/);
});
test('WebGL failure falls back, optional settings never block navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type.startsWith('webgl')) return null;
        return Reflect.apply(original, this, [type, ...args]);
      },
    });
  });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Enable 3D', exact: true }).click();
  await expect(page.locator('[data-scene-status]')).toHaveAttribute(
    'data-scene-status',
    'unavailable',
    { timeout: 15000 },
  );
  await expect(page.locator('canvas[data-aurora-canvas]')).toHaveCount(0);
  await page.getByText('Explore the material', { exact: false }).click();
  await expect(page.getByRole('slider', { name: /Energy/ })).toBeDisabled();
  await page.getByRole('link', { name: 'Selected work ↗', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects$/);
});
test('cinematic material, chapter changes, safe controls, static mode and context loss', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({
    width: testInfo.project.name === 'mobile' ? 390 : 1440,
    height: testInfo.project.name === 'mobile' ? 844 : 1000,
  });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Enable 3D', exact: true }).click();
  const journey = page.locator('[data-scene-status]');
  await expect(journey).toHaveAttribute('data-scene-status', /ready|unavailable/, {
    timeout: 20000,
  });
  if ((await journey.getAttribute('data-scene-status')) === 'unavailable') {
    test.skip(true, 'GPU is unavailable on this runner; the fallback is covered separately.');
    return;
  }
  for (const theme of ['dark', 'light']) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption(theme);
    await page.getByRole('button', { name: 'Close ×', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: testInfo.outputPath(`hero-${theme}.png`) });
  }
  await page.getByText('Explore the material', { exact: false }).click();
  await page.getByRole('slider', { name: /Energy/ }).press('Home');
  await page.getByRole('slider', { name: /Energy/ }).press('ArrowRight');
  await page.getByLabel('Palette', { exact: true }).selectOption('ice');
  await expect(page.getByRole('slider', { name: /Energy/ })).toHaveValue('0.05');
  await page.screenshot({ path: testInfo.outputPath('cinematic-hero.png') });
  await page.locator('#music').scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-chapter', 'music');
  await expect(page.locator('[data-kind="audio"]')).toHaveCount(1);
  await page.locator('#creator').scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-chapter', 'creator');
  await expect(page.locator('[data-kind="creator"]')).toHaveCount(1);
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-scene-host]')).toHaveAttribute('data-rendering', 'paused');
  await page.locator('#origin').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Static mode', exact: true }).click();
  await expect(page.locator('canvas[data-aurora-canvas]')).toHaveCount(0);
  await page.reload();
  await expect(journey).toHaveAttribute('data-scene-status', 'static');
  await page.getByRole('button', { name: 'Enable 3D', exact: true }).click();
  await expect(journey).toHaveAttribute('data-scene-status', 'ready', { timeout: 20000 });
  await page
    .locator('canvas[data-aurora-canvas]')
    .evaluate((canvas: HTMLCanvasElement) =>
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext(),
    );
  await expect(journey).toHaveAttribute('data-scene-status', 'unavailable');
  await expect(page.locator('canvas[data-aurora-canvas]')).toHaveCount(0);
});
test('SSR content and project navigation survive without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.getByRole('link', { name: 'Selected work ↗', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Kresov', exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});
test('tablet layout remains readable in both locales and themes', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of ['fr', 'en'])
    for (const theme of ['dark', 'light']) {
      await page.goto(`/${locale}`);
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page
        .getByRole('combobox', { name: locale === 'fr' ? 'Thème' : 'Theme', exact: true })
        .selectOption(theme);
      await page.keyboard.press('Escape');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
});
