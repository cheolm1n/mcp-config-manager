// Utility functions for config validation
export interface McpServers {
  [key: string]: {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    enabled?: boolean;
  };
}

export interface McpConfig {
  mcpServers?: McpServers;
  [key: string]: any;
}

export function filterEnabledServers(servers: McpServers): McpServers {
  const out: McpServers = {};
  Object.entries(servers).forEach(([k, v]) => {
    if (v.enabled === false) return;
    const { enabled, ...rest } = v as any;
    out[k] = rest;
  });
  return out;
}
