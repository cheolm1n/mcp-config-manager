import { toggleServer, isServerEnabled, AppState } from '../src/main/configUtil';

describe('configUtil', () => {
  test('toggleServer flips enabled state', () => {
    const initial: AppState = { servers: { a: { name: 'a', enabled: false } } };
    const updated = toggleServer(initial, 'a');
    expect(updated.servers.a.enabled).toBe(true);
  });

  test('toggleServer throws if server missing', () => {
    const initial: AppState = { servers: {} };
    expect(() => toggleServer(initial, 'nope')).toThrow('Server nope not found');
  });

  test('isServerEnabled returns current state', () => {
    const initial: AppState = { servers: { b: { name: 'b', enabled: true } } };
    expect(isServerEnabled(initial, 'b')).toBe(true);
  });
});
