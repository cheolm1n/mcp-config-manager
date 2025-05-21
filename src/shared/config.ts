// Shared helpers for config parsing and validation
import { z } from 'zod';

export const serverSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
  enabled: z.boolean().optional(),
});

export const configSchema = z.object({
  mcpServers: z.record(serverSchema).optional(),
  micVolume: z.number().optional(),
  noiseSuppressionLevel: z.number().optional(),
});

export type MCPConfig = z.infer<typeof configSchema>;

export function parseConfig(data: any): MCPConfig {
  return configSchema.parse(data);
}
