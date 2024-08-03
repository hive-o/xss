import { WeberBrowser } from '@hive-o/weber';
import * as async from 'async';

export interface Navigation {
  query_params: URLSearchParams;
  url: URL;
}

export class Xss {
  async scan(urls: Navigation[], payloads: string[]) {
    await async.forEachSeries(payloads, async (payload) => {
      await async.forEachSeries(
        urls,
        async ({ url }) => {
          const browser = WeberBrowser.instance();
          await browser.launch();
          const page = await browser.context.newPage();

          try {
            console.log(`scanning ${url} | payload ${payload}`);

            // Improved Error Handling and Event Management
            page.on("dialog", async (dialog) => {
              console.log("Found Vulnerability: ", dialog.message());
              await dialog.dismiss();
            });

            page.on("error", console.error); // Catch potential page errors

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
            console.log(`scanning ${url} | payload ${payload} completed`);
          }
        },
      );
    });
  }
}

