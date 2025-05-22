const { _electron: electron } = require('playwright');
const path = require('path');

test('launches app', async () => {
  const app = await electron.launch({ args: [path.join(__dirname, '../..')] });
  const window = await app.firstWindow();
  expect(await window.title()).toBe('MCP Config Manager');
  await app.close();
});
