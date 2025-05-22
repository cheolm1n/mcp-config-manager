# MCP Config Manager

Electron desktop application to manage Claude Desktop's Microphone Control Panel settings.

## Prerequisites
- Node.js >= 18
- npm or Yarn

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
npm run package:win   # Windows installer
npm run package:mac   # macOS dmg
npm run package:linux # Linux AppImage
```

## Example MCP Config
```json
{
  "mcpServers": {
    "sqlite": { "command": "sqlite" },
    "filesystem": { "command": "fs" }
  }
}
```
