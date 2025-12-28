
# Antigravity Instructions for Remix Rage

## Project Context
- **Framework**: React Router v7 (FKA Remix)
- **Runtime**: Cloudflare Workers (Edge) - **NO Node.js APIs**.
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Centralized Style Objects
- **Routing**: File-based (`@react-router/fs-routes`)

## Critical Constraints & Patterns
> [!IMPORTANT]
> These rules are strict. Violations will break the build or runtime.

### 1. Environment Variables
**Rule**: Dual-access pattern is REQUIRED for loaders/actions to support both Dev and Prod.
```typescript
const env = context.cloudflare?.env || context.env;
const secret = env?.CSRF_SECRET; // Example access
if (!secret) throw new Error("Missing Config");
```
- **Prod**: `context.cloudflare.env`
- **Dev**: `context.env` (via `load-context.ts`)

### 2. Styling Strategy
**Rule**: NEVER inline Tailwind classes in route files. ALL styles must be imported from `app/styles/`.
```typescript
// Correct
import { contactStyles as styles } from "~/styles/components";
<div className={styles.wrapper}>

// Incorrect
<div className="flex p-4 bg-red-500">
```
- **File Structure**:
  - `app/styles/components.ts`: Navigation, Cards, Forms, Footer
  - `app/styles/layout.ts`: Layout, Header
  - `app/styles/sections.ts`: Hero, Features, Services, et al.
- **Accessibility**:
  - `focus-visible:ring-2` required on interactive elements.
  - Dark mode (`dark:`) variants required.
  - Motion reduction (`motion-reduce:transition-none`) required.

### 3. Form & Security
**Rule**: All forms must implement CSRF protection, Rate Limiting, and Zod validation.
- **CSRF**: Generate token in loader, validate in action.
- **Rate Limit**: Implement per-worker-instance memory rate limiting.
- **Validation**: Strict Zod schemas.

## Development Workflow
| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (localhost:5173) |
| `pnpm run typecheck` | Run CF typegen + TSC |
| `pnpm run cf-typegen` | Regenerate worker types from wrangler.jsonc |
| `pnpm test` | Run Vitest |
| `pnpm run deploy` | Deploy to Cloudflare |

## Gotchas
1. **No Node.js**: Use `fetch`, Web Crypto API. Do not use `fs`, `path`, or `process`.
2. **Type Generation**: Run `pnpm run cf-typegen` anytime `wrangler.jsonc` changes.
3. **Secrets**: Managed via `wrangler secret put`, NOT in `wrangler.jsonc`.
4. **State**: Server-side only (loaders/actions). No global client state libraries (Redux/Zustand) unless explicitly requested.

## Directory Structure
- `workers/app.ts`: Cloudflare entry point
- `app/routes.ts`: Route definitions
- `app/routes/`: Route components
- `app/utils/*.server.ts`: Server-side utilities (database, auth, etc.)
