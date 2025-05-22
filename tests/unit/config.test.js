const { filterEnabledServers } = require('../../src/main/index');

test('filterEnabledServers removes disabled entries', () => {
  const cfg = {
    mcpServers: {
      a: { command: 'a', enabled: true },
      b: { command: 'b', enabled: false },
    },
  };
  const result = filterEnabledServers(cfg);
  expect(result.mcpServers.b).toBeUndefined();
  expect(result.mcpServers.a.command).toBe('a');
});
