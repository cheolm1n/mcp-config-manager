import { filterEnabledServers } from '../../src/main/configUtil';

describe('filterEnabledServers', () => {
  test('removes disabled entries', () => {
    const input = {
      sqlite: { command: 'run', enabled: true },
      notion: { command: 'run', enabled: false },
    };
    const result = filterEnabledServers(input as any);
    expect(result.notion).toBeUndefined();
    expect(result.sqlite.command).toBe('run');
  });
});
