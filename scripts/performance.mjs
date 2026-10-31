import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const base = process.env.PERF_URL ?? 'http://127.0.0.1:3100';
const name = process.env.PERF_LABEL ?? 'baseline';
const browser = await chromium.launch();
const results = [];
for (const mobile of [false, true]) {
  for (let run = 0; run < Number(process.env.PERF_RUNS ?? 3); run++) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    if (mobile) {
      await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await session.send('Network.enable');
      await session.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 100,
        downloadThroughput: 200000,
        uploadThroughput: 90000,
      });
    }
    await page.addInitScript(() => {
      window.__auroraPerf = { lcp: 0, cls: 0, longTaskMs: 0, interactionMs: 0 };
      for (const [type, handler] of Object.entries({
        'largest-contentful-paint': (entry) => {
          window.__auroraPerf.lcp = entry.startTime;
        },
        'layout-shift': (entry) => {
          if (!entry.hadRecentInput) window.__auroraPerf.cls += entry.value;
        },
        longtask: (entry) => {
          window.__auroraPerf.longTaskMs += Math.max(0, entry.duration - 50);
        },
        event: (entry) => {
          window.__auroraPerf.interactionMs = Math.max(
            window.__auroraPerf.interactionMs,
            entry.duration,
          );
        },
      })) {
        try {
          const observer = new PerformanceObserver((list) => list.getEntries().forEach(handler));
          observer.observe({ type, buffered: true, durationThreshold: 16 });
        } catch {}
      }
    });
    const bytes = new Map();
    const pending = [];
    page.on('response', (response) => {
      if (/\.js(?:\?|$)/.test(response.url()))
        pending.push(
          response
            .body()
            .then((buffer) =>
              bytes.set(response.url(), { raw: buffer.length, gzip: gzipSync(buffer).length }),
            )
            .catch(() => {}),
        );
    });
    await page.goto(`${base}${process.env.PERF_PATH ?? '/fr'}`, { waitUntil: 'load' });
    await page.waitForTimeout(7000);
    const metrics = await page.evaluate(async () => {
      const intervals = [];
      let previous = performance.now();
      await new Promise((resolve) => {
        const start = previous;
        function sample(now) {
          intervals.push(now - previous);
          previous = now;
          if (now - start < 1000) requestAnimationFrame(sample);
          else resolve();
        }
        requestAnimationFrame(sample);
      });
      return {
        ...window.__auroraPerf,
        loadMs: performance.getEntriesByType('navigation')[0].loadEventEnd,
        resources: performance
          .getEntriesByType('resource')
          .reduce((sum, item) => sum + item.transferSize, 0),
        frameP95Ms: intervals.sort((a, b) => a - b)[Math.floor(intervals.length * 0.95)] ?? 0,
        heapBytes: performance.memory?.usedJSHeapSize ?? null,
        canvas: !!document.querySelector('canvas[data-aurora-canvas]'),
        gpu: document.querySelector('[data-scene-host]')?.dataset
          ? { ...document.querySelector('[data-scene-host]').dataset }
          : null,
      };
    });
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.waitForTimeout(100);
    metrics.interactionMs = await page.evaluate(() => window.__auroraPerf.interactionMs);
    await Promise.all(pending);
    results.push({
      profile: mobile ? 'mobile-4x-slow4g' : 'desktop',
      run: run + 1,
      ...metrics,
      javaScriptRaw: [...bytes.values()].reduce((sum, item) => sum + item.raw, 0),
      javaScriptGzip: [...bytes.values()].reduce((sum, item) => sum + item.gzip, 0),
    });
    await context.close();
  }
}
await browser.close();
await fs.mkdir('docs/performance', { recursive: true });
await fs.writeFile(
  `docs/performance/${name}.json`,
  JSON.stringify(
    {
      label: name,
      base,
      note: 'Lab measurements, cold contexts/profile; see run counts. Interaction timing is a lab sample, not field INP. JS gzip is computed over fetched scripts. Heap is JS only; GPU memory is not exposed.',
      results,
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(results, null, 2));
