# MCP Config Manager

Desktop app for viewing and editing Claude Desktop MCP settings.

## Prerequisites
- Node.js 18+
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
npm run package:mac   # macOS DMG
npm run package:linux # Linux AppImage
```

## Testing
```bash
npm test
```

Unit tests live in `tests/unit/` and E2E tests in `tests/e2e/`.

## Example MCP Config
```json
{
  "mcpServers": {
    "sqlite": { "command": "run-sqlite" },
    "filesystem": { "command": "run-fs" },
    "notion": { "command": "run-notion" }
  }
}
```
