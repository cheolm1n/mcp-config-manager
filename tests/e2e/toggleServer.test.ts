import { test, expect } from '@playwright/test';
import { toggleServer, AppState } from '../../src/main/configUtil';

test('toggle server updates state', async () => {
  const state: AppState = { servers: { a: { name: 'a', enabled: false } } };
  const updated = toggleServer(state, 'a');
  expect(updated.servers.a.enabled).toBe(true);
});
