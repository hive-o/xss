const { Xss } = require('../dist/xss');

async function main() {
  const xss = new Xss();
  await xss.run({ uri: 'https://www.example.com' });
}

void main();
