export interface ServerConfig {
  name: string;
  enabled: boolean;
}

export interface AppState {
  servers: Record<string, ServerConfig>;
}

export function toggleServer(state: AppState, serverName: string): AppState {
  const server = state.servers[serverName];
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  const updated: ServerConfig = { ...server, enabled: !server.enabled };
  return {
    ...state,
    servers: { ...state.servers, [serverName]: updated }
  };
}

export function isServerEnabled(state: AppState, serverName: string): boolean {
  return !!state.servers[serverName]?.enabled;
}
