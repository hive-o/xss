import { Spider } from '@hive-o/spider';

import { Xss } from '../dist/xss';

async function main() {
  const xss = new Xss();
  const spider = new Spider();

  spider.use(async (context, next) => {
    await next();
  });

  await spider.run({
    uri: 'https://www.example.com',
  });

  const navigation = spider.navigation.entries();

  await xss.run({
    navigation,
    payloads: ['<script>alert("ok")</script>'],
    uri: 'https://www.example.com',
  });
}

void main();
