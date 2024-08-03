const { Xss } = require('../dist/xss');

async function main() {
  const xss = new Xss();
  const url = new URL('https://example.com?query=x');

  await xss.scan(
    [
      {
        searchParams: url.searchParams,
        url,
      },
    ],
    ['asd', 'asdasd', 'qweqeqe', 'asdasdasd']
  );
}

void main();
