import { parseConfig } from '../../src/shared/config';

describe('parseConfig', () => {
  it('parses valid config', () => {
    const data = { micVolume: 50, mcpServers: { sqlite: { command: 'run' } } };
    expect(parseConfig(data)).toBeTruthy();
  });

  it('throws on invalid config', () => {
    expect(() => parseConfig({ micVolume: 'bad' })).toThrow();
  });
});
