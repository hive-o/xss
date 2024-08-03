import { WeberBrowser } from '@hive-o/weber';
import * as DEBUG from 'debug';

export interface Navigation {
  searchParams: URLSearchParams;
  url: URL;
}

export class Xss {
  async scan(urls: Navigation[], payloads: string[]) {
    const debug = DEBUG('xss:scan');

    debug('started');
    debug('metrics | urls: %o, payloads: %o', urls.length, payloads.length);

    for await (const payload of payloads) {
      for await (const { searchParams, url } of urls) {
        const browser = WeberBrowser.instance();
        await browser.launch();
        const page = await browser.context.newPage();

        try {
          debug(`scanning ${url} | payload ${payload}`);

          // Improved Error Handling and Event Management
          page.on('dialog', async (dialog) => {
            debug('Found Vulnerability: ', dialog.message());
            await dialog.dismiss();
          });

          page.on('error', console.error); // Catch potential page errors

          searchParams.forEach((_, key) => {
            url.searchParams.append(key, payload);
          });

          await page.goto(url.toString(), {
            timeout: 20000,
            waitUntil: 'networkidle2',
          }); // Increased timeout, wait for network idle

          // Dynamic Wait for Page Content (Optional)
          await page.waitForFunction(() => document.readyState === 'complete', {
            timeout: 20000,
          });
        } catch (e) {
          console.error(`Error processing ${url.toString()}:`, e); // Log specific URL
        } finally {
          await page.close();
          await browser.close();
          debug(`scanning ${url} | payload ${payload} completed`);
        }
      }
    }
  }
}
