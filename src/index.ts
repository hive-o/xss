import { WeberBrowser } from '@hive-o/weber';
import * as async from 'async';

export interface Navigation {
  query_params: URLSearchParams;
  url: URL;
}

export class Xss {
  async scan(urls: Navigation[], payloads: string[]) {
    await async.forEachSeries(payloads, async (payload: string) => {
      await async.forEachSeries(urls, async ({ url }) => {
        const browser = WeberBrowser.instance();
        await browser.launch();

        const context = browser.context;
        const page = await context.newPage();

        try {
          console.log(`scanning ${url} | payload ${payload}`);

          page.on('dialog', async (dialog) => {
            console.log('Found Vulnerability: ', dialog.message());
            await dialog.dismiss();
          });

          page.on('error', console.error);
          url.searchParams.append('query', payload);

          await page.goto(url.toString(), {
            timeout: 20000,
            waitUntil: 'networkidle2',
          });

          await page.waitForFunction(() => document.readyState === 'complete', {
            timeout: 20000,
          });
        } catch (e) {
          console.error(`Error processing ${url.toString()}:`, e); // Log specific URL
        } finally {
          await page.close();
          await browser.close();
          console.log(`scanning ${url} | payload ${payload} completed`);
        }
      });
    });
  }
}

