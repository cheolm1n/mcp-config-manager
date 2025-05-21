# MCP Config Manager

Electron + Vue 3 desktop app for editing Claude MCP settings.

## Prerequisites
- Node.js 18+
- npm or yarn

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Package
```bash
npm run package:win # Windows
npm run package:mac # macOS
npm run package:linux # Linux
```

## Example MCP Config
```json
{
  "micVolume": 70,
  "noiseSuppressionLevel": 3,
  "mcpServers": {
    "sqlite": { "command": "run-sqlite" },
    "filesystem": { "command": "run-fs" },
    "notion": { "command": "run-notion" }
  }
}
```
