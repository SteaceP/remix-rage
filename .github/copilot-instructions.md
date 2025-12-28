# Copilot Instructions for Remix Rage

## Architecture

**React Router v7** on **Cloudflare Workers** — Web APIs only (no Node.js).

| Layer | Tech | Key Files |
|-------|------|-----------|
| Runtime | Cloudflare Workers | `workers/app.ts`, `wrangler.jsonc` |
| Routing | File-based `@react-router/fs-routes` | `app/routes.ts`, `app/routes/*.tsx` |
| Styling | Tailwind CSS v4 + centralized style objects | `app/styles/` |
| Forms | CSRF + Zod + rate limiting | `app/utils/*.server.ts` |

## Commands

```bash
pnpm dev              # Dev server at localhost:5173
pnpm run build        # Production build
pnpm run deploy       # Build + deploy to Cloudflare
pnpm run typecheck    # TypeScript + Cloudflare types (runs cf-typegen first)
pnpm run cf-typegen   # Regenerate worker-configuration.d.ts from wrangler.jsonc
pnpm test             # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage report
```

## Critical Patterns

### 1. Environment Variables (dev vs prod)
```tsx
// ALWAYS use this dual-access pattern in loaders/actions:
const env = context.cloudflare?.env || context.env;
const secret = env?.CSRF_SECRET;
if (!secret) throw new Error("CSRF_SECRET not configured");
```
- **Production**: `context.cloudflare.env.VAR` (Cloudflare secrets)
- **Development**: `context.env.VAR` (from `.env` file via `load-context.ts`)

### 2. Centralized Styles (never inline Tailwind in routes)
```tsx
// Import from app/styles/, use object properties
import { contactStyles as styles } from "~/styles/components";
export default function Page() {
  return <div className={styles.wrapper}>...</div>;
}
```
**Style file organization:**
- `components.ts` — navigation, cards, form, footer, contactStyles
- `layout.ts` — layout, header
- `sections.ts` — hero, features, services, cta, page, serviceCards, pricing

### 3. Form Security Stack (see `app/routes/contact.tsx`)
```tsx
// Loader: generate CSRF token
const { token, cookieHeader } = await createCsrfToken(request, env.CSRF_SECRET);
return Response.json({ csrfToken: token }, { headers: { "Set-Cookie": cookieHeader } });

// Action: validate all layers
const rateLimit = checkRateLimit(getRateLimitKey(request), 3, 60000);
if (!rateLimit.allowed) return Response.json({ error: "Too many requests" }, { status: 429 });
await validateCsrfToken(request, formData.get("csrfToken"), env.CSRF_SECRET);
const validated = emailSchema.parse(data); // Zod validation
```

### 4. Route File Structure
```tsx
import type { Route } from "./+types/_index";  // Auto-generated types
import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Page - Code Rage" }, { name: "description", content: "..." }];
}
export async function loader({ request, context }: LoaderFunctionArgs) { ... }
export async function action({ request, context }: ActionFunctionArgs) { ... }
export default function Page() { ... }
```

## Gotchas

1. **No Node.js APIs** — use `fetch()`, Web Crypto API, `Request`/`Response`
2. **Type generation** — run `pnpm run cf-typegen` after changing `wrangler.jsonc`
3. **Secrets** — set via `wrangler secret put NAME`, never in `wrangler.jsonc`
4. **Security headers** — configured in `public/_headers`, not in code
5. **State** — use loaders/actions exclusively; no client-side state libraries
6. **Rate limiter** — in-memory per-worker-instance; resets on cold starts and doesn't share across isolates

## Known Technical Debt

- `app/routes/_index.tsx` defines styles inline instead of importing from `app/styles/` — should be refactored to use centralized styles

## Style Requirements (WCAG 2.1 AA)

All style objects must include:
- `focus-visible:ring-2` on interactive elements (not just `focus`)
- `motion-reduce:transition-none` for animations/transforms
- `dark:` variants for all colors
- `disabled:opacity-50 disabled:cursor-not-allowed` for disabled states
- Transition durations: **200ms** (simple), **300ms** (scale/shadows)

## External Integrations

| Service | Env Var | Usage |
|---------|---------|-------|
| Brevo API | `BREVO_API_KEY` | Contact form emails (`app/utils/email.server.ts`) |
| Cloudflare | `CSRF_SECRET` | CSRF token signing |

**Local dev**: Create `.env` with `CSRF_SECRET` and `BREVO_API_KEY`
**Production**: Set via Cloudflare dashboard or `wrangler secret put`

## Testing

Tests use **Vitest** with coverage via `@vitest/coverage-v8`. Test files live alongside source files with `.test.ts` suffix.

```bash
pnpm test             # Run once
pnpm run test:watch   # Watch mode
pnpm run test:coverage # With coverage
```

**Existing tests:** `app/utils/token.server.test.ts`, `app/utils/rate-limit.server.test.ts`

When adding tests:
- Mock `context.cloudflare.env` for loader/action tests
- Use `vi.useFakeTimers()` for time-dependent tests (rate limiting)
- Consider Playwright for e2e contact form flow
