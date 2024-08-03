import { WeberBrowser } from '@hive-o/weber';
import * as async from 'async';
import * as DEBUG from 'debug';

export interface Navigation {
  query_params: URLSearchParams;
  url: URL;
}

export class Xss {
  private debugger(tag) {
    return DEBUG(`xss|{${tag}}`);
  }

  async scan(urls: Navigation[], payloads: string[]) {
    const debug = this.debugger('scan()');

    debug('started');
    debug('urls %o', urls.map(({url}) => `${url} `));
    await async.forEachSeries(payloads, async (payload) => {
      await async.forEachSeries(
        urls,
        async ({ url }) => {
          const browser = WeberBrowser.instance();
          await browser.launch();
          const page = await browser.context.newPage();

          try {
            debug(`scanning ${url} | payload ${payload}`);

            // Improved Error Handling and Event Management
            page.on("dialog", async (dialog) => {
              debug("Found Vulnerability: ", dialog.message());
              await dialog.dismiss();
            });

            page.on("error", debug); // Catch potential page errors

            url.searchParams.append("query", payload);

            await page.goto(url.toString(), {
              timeout: 20000,
              waitUntil: "networkidle2",
            }); // Increased timeout, wait for network idle

            // Dynamic Wait for Page Content (Optional)
            await page.waitForFunction(
              () => document.readyState === "complete",
              {
                timeout: 20000,
              },
            );
          } catch (e) {
            console.error(`Error processing ${url.toString()}:`, e); // Log specific URL
          } finally {
            await page.close();
            await browser.close();
            debug(`scanning ${url} | payload ${payload} completed`);
          }
        },
      );
    });
  }
}

