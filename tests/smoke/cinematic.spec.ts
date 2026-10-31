import { test, expect } from '@playwright/test';
const waitForScene = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('[data-scene-status]')).toHaveAttribute(
    'data-scene-status',
    /ready|unavailable/,
    { timeout: 25000 },
  );
  return (await page.locator('[data-scene-status]').getAttribute('data-scene-status')) === 'ready';
};
test('reduced motion keeps a sharp static 3D and independent interface motion', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr');
  if (!(await waitForScene(page))) {
    test.skip(true, 'WebGL unavailable; fallback covered separately.');
    return;
  }
  await expect(page.locator('canvas[data-aurora-canvas]')).toHaveCount(1);
  await expect(page.locator('[data-scene-host]')).toHaveAttribute('data-rendering', 'static');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'soft');
  await expect(page.getByRole('button', { name: 'Animer la 3D', exact: true })).toBeEnabled();
  const frames = await page.locator('[data-scene-host]').getAttribute('data-frames');
  await page.waitForTimeout(160);
  expect(await page.locator('[data-scene-host]').getAttribute('data-frames')).toBe(frames);
  await page.screenshot({ path: info.outputPath('static-3d.png') });
  await page.getByRole('main').getByRole('link', { name: 'Projets', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/projects$/);
});
test('WebGL failure is an exceptional CSS fallback and navigation remains available', async ({
  page,
}) => {
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
  await expect(page.locator('[data-scene-status]')).toHaveAttribute(
    'data-scene-status',
    'unavailable',
    { timeout: 20000 },
  );
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByText('Explore the material', { exact: false }).click();
  await expect(page.getByRole('slider', { name: 'Energy', exact: true })).toBeDisabled();
  await page.getByRole('main').getByRole('link', { name: 'Selected work', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects$/);
});
test('retina 3D, chapter transforms, static canvas retained, controls and context loss', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en');
  if (!(await waitForScene(page))) {
    test.skip(true, 'WebGL unavailable on runner.');
    return;
  }
  const journey = page.locator('[data-scene-status]'),
    host = page.locator('[data-scene-host]'),
    canvas = page.locator('canvas[data-aurora-canvas]');
  expect(
    await canvas.evaluate(
      (node: HTMLCanvasElement) =>
        node.width >=
        Math.floor(node.getBoundingClientRect().width * Math.min(devicePixelRatio, 2)) - 1,
    ),
  ).toBe(true);
  for (const theme of ['dark', 'light']) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition', 'true', {
      timeout: 5000,
    });
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`hero-${theme}.png`) });
  }
  await page.getByText('Explore the material', { exact: false }).click();
  await page.getByRole('slider', { name: 'Energy', exact: true }).press('Home');
  await page.getByRole('slider', { name: 'Energy', exact: true }).press('ArrowRight');
  await page.getByRole('combobox', { name: 'Palette', exact: true }).selectOption('ice');
  await expect(page.getByRole('slider', { name: 'Energy', exact: true })).toHaveValue('0.05');
  await page.locator('#music').scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-chapter', 'music');
  await expect(page.locator('[data-kind="audio"]')).toHaveCount(1);
  await page.locator('#creator').scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-chapter', 'creator');
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute('data-rendering', 'paused');
  await page.locator('#origin').scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute('data-rendering', 'active');
  const handle = await canvas.elementHandle();
  await page.getByRole('button', { name: 'Static mode', exact: true }).click();
  await expect(host).toHaveAttribute('data-rendering', 'static');
  expect(await handle!.evaluate((node) => node.isConnected)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  const frames = await host.getAttribute('data-frames');
  await page.waitForTimeout(160);
  expect(await host.getAttribute('data-frames')).toBe(frames);
  await page.locator('#music').scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-chapter', 'music');
  await expect(host).toHaveAttribute('data-rendering', 'transitioning');
  const morphFrames = Number(await host.getAttribute('data-frames'));
  await expect
    .poll(async () => Number(await host.getAttribute('data-frames')))
    .toBeGreaterThan(morphFrames);
  await expect(host).toHaveAttribute('data-rendering', 'static');
  const settledFrames = await host.getAttribute('data-frames');
  await page.waitForTimeout(180);
  expect(await host.getAttribute('data-frames')).toBe(settledFrames);
  await page.reload();
  expect(await waitForScene(page)).toBe(true);
  await expect(host).toHaveAttribute('data-rendering', 'static');
  await page.getByRole('button', { name: 'Animate 3D', exact: true }).click();
  await expect(host).toHaveAttribute('data-rendering', 'active');
  await canvas.evaluate((node: HTMLCanvasElement) =>
    node.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext(),
  );
  await expect(journey).toHaveAttribute('data-scene-status', 'unavailable');
  await expect(canvas).toHaveCount(0);
});
test('SSR reading and main navigation survive without JavaScript', async ({ browser, baseURL }) => {
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
    await page.getByRole('main').getByRole('link', { name: 'Selected work', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Kresov', exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});
test('tablet themes animate, both languages remain readable, Sponsors is in desktop navbar', async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  for (const locale of ['fr', 'en']) {
    await page.goto(`/${locale}`);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    for (const theme of ['dark', 'light']) {
      await page
        .getByRole('combobox', { name: locale === 'fr' ? 'Thème' : 'Theme', exact: true })
        .selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition', 'true', {
        timeout: 5000,
      });
    }
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(
    page.locator('header nav').getByRole('link', { name: 'Sponsors', exact: true }),
  ).toBeVisible();
});
test('Tristan branding, SVG icons, approved social destinations and no text arrows', async ({
  page,
}, info) => {
  await page.goto('/fr/contact');
  await expect(page).toHaveTitle(/Tristan/);
  expect(await page.locator('body').innerText()).not.toMatch(/Aurora|[↗↘←→↓↑↺]/);
  const links = page.locator('main .social-links a');
  await expect(links).toHaveCount(10);
  for (const name of [
    'GitHub',
    'LinkedIn',
    'Email',
    'Buy Me a Coffee',
    'X',
    'Instagram',
    'Pinterest',
    'TikTok',
    'YouTube',
    'Discord',
  ])
    await expect(
      page.locator('main .social-links').getByRole('link', { name, exact: true }).locator('svg'),
    ).toHaveCount(1);
  await expect(
    page.locator('main .social-links').getByRole('link', { name: 'X', exact: true }),
  ).toHaveAttribute('href', 'https://www.x.com/Tristan__Jcb');
  await expect(
    page.locator('main .social-links').getByRole('link', { name: 'YouTube', exact: true }),
  ).toHaveAttribute('href', 'https://www.youtube.com/');
  await expect(page.locator('footer .social-links a')).toHaveCount(10);
  await page.screenshot({ path: info.outputPath('contact-icons.png'), fullPage: true });
});
