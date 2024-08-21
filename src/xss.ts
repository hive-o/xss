import { ArtaxContext } from '@hive-o/artax-common';
import { Middleware, Next } from '@hive-o/middleware';
import { WeberBrowser } from '@hive-o/weber';
import * as DEBUG from 'debug';
import { isEmpty } from 'lodash';

export class Xss extends Middleware {
  async run(
    contextOrNext?: ArtaxContext | Next,
    optionalNext?: Next
  ): Promise<this> {
    this.use(async (context, next) => {
      const debug = DEBUG('xss:scan');

      if (isEmpty(context.payloads) && isEmpty(context.uri)) {
        throw new Error('missing payloads | uri');
      }

      debug('started');
      for await (const payload of context.payloads) {
        for await (const { searchParams, uri } of context.navigation) {
          const browser = WeberBrowser.instance();
          await browser.launch();

          const page = await browser.context.newPage();

          try {
            debug(`scanning ${uri} | payload ${payload}`);

            // Improved Error Handling and Event Management
            page.on('dialog', async (dialog) => {
              debug('Found Vulnerability: ', dialog.message());
              await dialog.dismiss();
            });

            page.on('error', console.error); // Catch potential page errors

            searchParams.forEach((_, key) => {
              uri.searchParams.append(key, payload);
            });

            await page.goto(uri.toString(), {
              timeout: 20000,
              waitUntil: 'networkidle2',
            }); // Increased timeout, wait for network idle

            // Dynamic Wait for Page Content (Optional)
            await page.waitForFunction(
              () => document.readyState === 'complete',
              {
                timeout: 20000,
              }
            );
          } catch (e) {
            console.error(`Error processing ${uri.toString()}:`, e); // Log specific URL
          } finally {
            await page.close();
            await browser.close();
            debug(`scanning ${uri} | payload ${payload} completed`);
          }
        }
      }

      await next();
      debug('completed');
    });

    return super.run(contextOrNext, optionalNext);
  }
}
