import { test, expect } from '@playwright/test';
for (const locale of ['fr', 'en']) {
  test(`${locale}: direct URLs and metadata`, async ({ page }) => {
    for (const path of [
      '',
      '/me',
      '/projects',
      '/projects/dev',
      '/projects/music',
      '/projects/creator',
      '/projects/dev/kresov',
      '/projects/dev/dockerscope',
      '/projects/music/cursed',
      '/projects/music/ep-2',
      '/projects/creator/coming-soon',
      '/blog',
      '/sponsors',
      '/contact',
    ]) {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://tristan.kresov.com/${locale}${path}`,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        path,
      ).toBe(true);
    }
  });
}
test('menu, keyboard search, theme persistence and locale', async ({ page }) => {
  await page.goto('/fr');
  await page.getByRole('button', { name: 'Menu' }).click();
  const menu = page.getByRole('dialog', { name: 'TRISTAN / Menu' });
  await expect(menu).toBeVisible();
  await menu.getByLabel('Thème', { exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Rechercher' });
  await expect(search).toBeVisible();
  await search.getByRole('textbox').fill('Docker');
  await search.getByRole('link', { name: /DockerScope/ }).click();
  await expect(page).toHaveURL(/\/fr\/projects\/dev\/dockerscope$/);
  await page.locator('header').getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects\/dev\/dockerscope$/);
});
test('project filter, empty journal, 404s and historical redirects', async ({ page, request }) => {
  await page.goto('/en/projects');
  await page.getByRole('button', { name: 'Music', exact: true }).click();
  await expect(page.locator('article.project-card')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Kresov', exact: true })).toHaveCount(0);
  expect((await page.goto('/en/projects/dev/unknown'))?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('This page does not exist.');
  expect((await page.goto('/xx'))?.status()).toBe(404);
  expect((await page.goto('/en/blog/no-invented-article'))?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('This page does not exist.');
  for (const [source, target] of Object.entries({
    about: '/en/me',
    partners: '/en/sponsors',
    music: '/en/projects/music',
  })) {
    const response = await request.get(`/${source}`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(target);
  }
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<rss');
  expect((await request.get('/sitemap.xml')).ok()).toBe(true);
  const github = await request.get('/github', { maxRedirects: 0 });
  expect(github.headers().location).toBe('https://github.com/tristanjcb');
});
test('contact creates a mailto draft without submitting to a server', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(page.getByRole('link', { name: /tristan@kresov.com/ }).first()).toHaveAttribute(
    'href',
    'mailto:tristan@kresov.com',
  );
  await page.getByLabel('Your name').fill('Test');
  await page.getByLabel('Subject', { exact: true }).fill('A project');
  await page.getByLabel('Your message').fill('Hello Aurora');
  await page.getByRole('button', { name: /Prepare my email/ }).click();
  await expect(
    page.getByText('Your email application was requested.', { exact: false }),
  ).toBeVisible();
});

test('dark defaults ignore OS color scheme, migrate system and preserve explicit light', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/fr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const select = page.getByRole('combobox', { name: 'Thème', exact: true });
  await expect(select.locator('option')).toHaveCount(2);
  await expect(select).toHaveValue('dark');
  await select.selectOption('light');
  // View Transition invokes the theme update asynchronously; await the actual selection.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('aurora-theme'))).toBe('light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.evaluate(() => localStorage.setItem('aurora-theme', 'system'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('aurora-theme'))).toBe('dark');
});

test('homepage browser and social titles use the exact portfolio title', async ({ page }) => {
  for (const locale of ['fr', 'en']) {
    await page.goto(`/${locale}`);
    await expect(page).toHaveTitle('Tristan Jacob / Portfolio');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Tristan Jacob / Portfolio',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Tristan Jacob / Portfolio',
    );
  }
});
