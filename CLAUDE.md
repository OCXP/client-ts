# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@ocxp/client -- TypeScript SDK for the OCXP protocol, auto-generated from the OpenAPI specification produced by contexthub-brain. This package is consumed by contexthub-obsidian via npm-link.

**Version**: 0.2.8
**Package**: `@ocxp/client` (ESM + CJS dual output)

## Update Flow

```
contexthub-brain (Python API)
    |
    +--> openapi.json
            |
            +--> [copy to this repo]
                    |
                    +--> npm run generate (hey-api/openapi-ts)
                            |
                            +--> npm run build (tsup)
                                    |
                                    +--> contexthub-obsidian consumes via npm-link
```

When the brain API changes:
1. Copy updated `openapi.json` from brain to this repo root
2. Run `npm run generate` to regenerate TypeScript client
3. Run `npm run build` to compile
4. Obsidian plugin picks up changes automatically via npm-link

## Build Commands

```bash
npm run generate        # Regenerate TS client from openapi.json (hey-api/openapi-ts)
npm run build           # Build with tsup (ESM + CJS)
npm run dev             # Watch mode with auto-rebuild
npm run typecheck       # TypeScript type checking (tsc --noEmit)
npm run test            # Run tests (Vitest, watch mode)
npm run test:run        # Run tests once
npm run test:coverage   # Tests with coverage
npm run lint            # ESLint
npm run lint:fix        # ESLint with auto-fix
npm run format          # Prettier format
```

## Architecture

### Code Generation

- **@hey-api/openapi-ts** -- Generates TypeScript client from `openapi.json`
- **Config**: `openapi-ts.config.ts`
- **Output**: `src/generated/` -- DO NOT edit files in this directory manually

### Build System

- **tsup** -- Bundles to ESM (`dist/index.js`) + CJS (`dist/index.cjs`) with type declarations
- **Config**: `tsup.config.ts`

### Validation

- **Zod v4** -- Runtime schema validation
- **Schemas**: `src/schemas/` and `schemas/`

### Testing

- **Vitest** -- Test runner with `vitest.config.ts`
- **MSW** -- Mock Service Worker for HTTP mocking in tests

## Key Files

| File | Auto-generated | Description |
|---|---|---|
| `openapi.json` | Yes (from brain) | Source OpenAPI spec |
| `src/generated/` | Yes (from openapi-ts) | Generated client code -- DO NOT edit |
| `src/index.ts` | No | Package entry point, re-exports |
| `src/client.ts` | No | Client wrapper and configuration |
| `src/types/` | No | Custom type definitions |
| `src/schemas/` | No | Zod validation schemas |
| `src/path.ts` | No | Path utilities |
| `src/path-service.ts` | No | Path service |
| `src/websocket.ts` | No | WebSocket client |
| `openapi-ts.config.ts` | No | Code generation config |
| `tsup.config.ts` | No | Build config |

## Cross-Repository Context

### npm-link with Obsidian

This package is npm-linked into the obsidian plugin:
- **Obsidian location**: `/Users/andre/Sonic-Web-Dev/contexthub/contexthub-obsidian`
- After `npm run build` here, the obsidian plugin immediately sees the updated package

### Source API (Brain)

- **Brain location**: `/Users/andre/Sonic-Web-Dev/contexthub/contexthub-brain`
- **OpenAPI spec source**: `functions/ocxp/api/` generates `openapi.json`
- **Brain CLAUDE.md**: `/Users/andre/Sonic-Web-Dev/contexthub/contexthub-brain/CLAUDE.md`

### Related CLAUDE.md Files

- **Brain**: `/Users/andre/Sonic-Web-Dev/contexthub/contexthub-brain/CLAUDE.md`
- **Obsidian**: `/Users/andre/Sonic-Web-Dev/contexthub/contexthub-obsidian/CLAUDE.md`
