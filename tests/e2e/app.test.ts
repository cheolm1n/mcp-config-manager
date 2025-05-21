const { Application } = require('spectron');
const path = require('path');

describe('App launch', () => {
  test('shows window', async () => {
    const app = new Application({
      path: path.join(__dirname, '../../node_modules/.bin/electron'),
      args: [path.join(__dirname, '../../dist/main')],
    });
    await app.start();
    const count = await app.client.getWindowCount();
    expect(count).toBeGreaterThan(0);
    await app.stop();
  });
});
